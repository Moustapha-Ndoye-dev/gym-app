import { Router } from 'express';
import { login, registerGym } from '../controllers/authController';
import { MemberModel } from '../models/memberModel';
import { UserModel } from '../models/userModel';
import { loginLimiter } from '../middleware/rateLimiter';
import { validate } from '../middleware/validate';
import { z } from 'zod';
import prisma from '../config/db';

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Gestion de l'authentification
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Login:
 *       type: object
 *       required:
 *         - username
 *         - password
 *       properties:
 *         username:
 *           type: string
 *         password:
 *           type: string
 *     MemberRegister:
 *       type: object
 *       required:
 *         - first_name
 *         - last_name
 *         - email
 *         - phone
 *       properties:
 *         first_name:
 *           type: string
 *         last_name:
 *           type: string
 *         email:
 *           type: string
 *         phone:
 *           type: string
 */

const loginSchema = z.object({
  body: z.object({
    username: z
      .string()
      .min(3, "Le nom d'utilisateur doit contenir au moins 3 caractères"),
    password: z
      .string()
      .min(5, 'Le mot de passe doit contenir au moins 5 caractères'),
  }),
});

const memberSchema = z.object({
  body: z
    .object({
      username: z
        .string()
        .min(3, "Le nom d'utilisateur doit contenir au moins 3 caractères"),
      email: z.string().email('Email invalide'),
      password: z
        .string()
        .min(5, 'Le mot de passe doit contenir au moins 5 caractères'),
      confirmPassword: z
        .string()
        .min(
          5,
          'La confirmation du mot de passe doit contenir au moins 5 caractères'
        ),
      gymId: z.number().optional(),
      // Optional fields for now to match Member model
      first_name: z.string().optional(),
      last_name: z.string().optional(),
      phone: z.string().optional(),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: 'Les mots de passe ne correspondent pas',
      path: ['confirmPassword'],
    }),
});

const registerGymSchema = z.object({
  body: z.object({
    gymName: z.string().min(2, 'Le nom de la salle est requis'),
    gymEmail: z.string().email('Email de la salle invalide'),
    adminUsername: z.string().min(3, "Le nom d'utilisateur admin est requis"),
    adminPassword: z
      .string()
      .min(5, 'Le mot de passe doit contenir au moins 5 caractères'),
  }),
});

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Connecter un utilisateur
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Login'
 *     responses:
 *       200:
 *         description: Succès de la connexion
 *       401:
 *         description: Identifiants incorrects
 */
// router.post('/login', loginLimiter, validate(loginSchema), login);
router.post('/login', validate(loginSchema), login);

/**
 * @swagger
 * /api/auth/register-member:
 *   post:
 *     summary: Inscription publique d'un nouveau membre
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/MemberRegister'
 *     responses:
 *       201:
 *         description: Membre inscrit avec succès
 *       400:
 *         description: Données invalides ou email déjà utilisé
 */
router.post('/register-member', validate(memberSchema), async (req, res) => {
  console.log('[AUTH-TRACE] Received request on /register-member');
  console.log('[AUTH-TRACE] Request body:', JSON.stringify(req.body, null, 2));

  const { username, password, email, gymId, ...extraData } = req.body;
  console.log(
    `[AUTH-DEV] >>> Member registration attempt: "${username}" / "${email}"`
  );
  console.log('[AUTH-TRACE] extraData:', JSON.stringify(extraData, null, 2));


  try {
    // 1. Resolve Gym ID - Robust Fallback
    console.log(
      `[AUTH-DEV] Resolving Gym ID (Client requested: ${gymId || 'none'})...`
    );
    let finalGymId = gymId;
    let gymFound = false;

    if (finalGymId) {
      const checkGym = await prisma.gym.findUnique({
        where: { id: finalGymId },
      });
      if (checkGym) {
        gymFound = true;
        console.log(
          `[AUTH-DEV] Requested Gym ID ${finalGymId} validated: "${checkGym.name}"`
        );
      } else {
        console.log(
          `[AUTH-DEV] Requested Gym ID ${finalGymId} not found. Searching for fallback...`
        );
      }
    }

    if (!gymFound) {
      const firstGym = await prisma.gym.findFirst();
      if (!firstGym) {
        console.error(
          `[AUTH-DEV] ! CRITICAL FAILURE ! No Gym records exist in Database.`
        );
        return res.status(400).json({
          message:
            'Configuration manquante : Aucune salle de sport trouvée. Contactez le support.',
        });
      }
      finalGymId = firstGym.id;
      console.log(
        `[AUTH-DEV] Fallback successful. Using Gym ID ${finalGymId} ("${firstGym.name}")`
      );
    }

    console.log('[AUTH-TRACE] finalGymId:', finalGymId);


    // 2. Create User account - Assigning 'member' role for public registration
    const user = await UserModel.createUser(
      username,
      password,
      'member',
      finalGymId,
      email
    );
    console.log('[AUTH-TRACE] UserModel.createUser returned:', JSON.stringify(user, null, 2));
    console.log(
      `[AUTH-DEV] Step 1/2 Success: User created with ID: ${user.id}`
    );

    // 3. Create Member profile
    const memberArgs = {
      email,
      firstName: extraData.first_name || username,
      lastName: extraData.last_name || 'Membre',
      phone: extraData.phone,
      gymId: finalGymId,
    };
    console.log('[AUTH-TRACE] Calling MemberModel.create with:', JSON.stringify(memberArgs, null, 2));
    const memberId = await MemberModel.create(memberArgs);
    console.log('[AUTH-TRACE] MemberModel.create returned:', memberId);
    console.log(
      `[AUTH-DEV] Step 2/2 Success: Member profile created with ID: ${memberId}`
    );

    console.log(`[AUTH-DEV] <<< Registration COMPLETED for "${username}"`);
    res.status(201).json({ id: memberId, message: 'Inscription réussie !' });
  } catch (error: any) {
    console.error('[AUTH-DEV] !!! REGISTRATION FAILED !!! Details:', error);
    console.error('[AUTH-TRACE] Error object:', JSON.stringify(error, null, 2));

    if (error.code === 'P2002') {
      const target = error.meta?.target || '';
      console.log(`[AUTH-DEV] Conflict: Duplicate entry in ${target}`);
      if (typeof target === 'string' && target.includes('username')) {
        return res
          .status(400)
          .json({ message: "Ce nom d'utilisateur est déjà pris." });
      }
      if (typeof target === 'string' && target.includes('email')) {
        return res.status(400).json({ message: 'Cet email est déjà utilisé.' });
      }
    }

    res.status(500).json({
      message: "Erreur technique durant l'inscription.",
      error: error?.message || String(error),
    });
  }
});

/**
 * @swagger
 * /api/auth/register-gym:
 *   post:
 *     summary: Enregistrer une nouvelle salle de gym
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               gymName:
 *                 type: string
 *               gymEmail:
 *                 type: string
 *               adminUsername:
 *                 type: string
 *               adminPassword:
 *                 type: string
 */
router.post('/register-gym', validate(registerGymSchema), registerGym);

export default router;
