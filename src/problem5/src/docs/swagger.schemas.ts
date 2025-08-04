/**
 * @swagger
 * components:
 *   schemas:
 *     CreateUserDto:
 *       type: object
 *       required:
 *         - fullName
 *         - userName
 *         - password
 *       properties:
 *         fullName:
 *           type: string
 *         userName:
 *           type: string
 *         password:
 *           type: string
 *
 *     UpdateUserDto:
 *       type: object
 *       properties:
 *         fullName:
 *           type: string
 *         password:
 *           type: string
 *
 *     UserDto:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *         fullName:
 *           type: string
 *         userName:
 *           type: string
 *         createdAt:
 *           type: string
 *         updatedAt:
 *           type: string
 *
 *     UserRegisterResponseDto:
 *       type: object
 *       properties:
 *         user:
 *           $ref: '#/components/schemas/UserDto'
 *         accessToken:
 *           type: string
 *         resetToken:
 *           type: string
 *     GetUsersQuery:
 *       type: object
 *       properties:
 *         page:
 *           type: integer
 *           default: 1
 *           description: Page number
 *         limit:
 *           type: integer
 *           default: 10
 *           description: Items per page
 *         userName:
 *           type: string
 *           description: Filter by userName
 *         fullName:
 *           type: string
 *           description: Filter by fullName
 */
