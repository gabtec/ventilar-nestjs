// // from chatGPT
// import { Test, TestingModule } from '@nestjs/testing';
// import { LoginController } from './login.controller';
// import { AuthService } from './auth.service';
// import { LoginCredentialsDto } from './dto/login-credentials.dto';

// describe('LoginController', () => {
//   let controller: LoginController;
//   let authService: AuthService;

//   beforeEach(async () => {
//     const module: TestingModule = await Test.createTestingModule({
//       controllers: [LoginController],
//       providers: [AuthService],
//     }).compile();

//     controller = module.get<LoginController>(LoginController);
//     authService = module.get<AuthService>(AuthService);
//   });

//   describe('login', () => {
//     it('should return a user object and access token on successful login', async () => {
//       const credentialsDto: LoginCredentialsDto = {
//         username: 'testuser',
//         password: 'testpassword',
//       };

//       const mockData = {
//         user: { id: 1, username: 'testuser' },
//         accessToken: 'testaccesstoken',
//         refreshToken: 'testrefreshtoken',
//       };

//       jest.spyOn(authService, 'login').mockResolvedValue(mockData);

//       const mockResponse = {
//         cookie: jest.fn(),
//       };

//       const result = await controller.login(credentialsDto, mockResponse);

//       expect(authService.login).toHaveBeenCalledWith(credentialsDto);
//       expect(mockResponse.cookie).toHaveBeenCalledWith(
//         'cookieName',
//         'testrefreshtoken',
//         { cookieOptions },
//       );
//       expect(result).toEqual({
//         user: { id: 1, username: 'testuser' },
//         accessToken: 'testaccesstoken',
//       });
//     });

//     it('should return a 401 error on failed login', async () => {
//       const credentialsDto: LoginCredentialsDto = {
//         username: 'testuser',
//         password: 'testpassword',
//       };

//       const mockError = new Error('Invalid credentials');

//       jest.spyOn(authService, 'login').mockRejectedValue(mockError);

//       const mockResponse = {
//         status: jest.fn().mockReturnThis(),
//         json: jest.fn(),
//       };

//       await expect(
//         controller.login(credentialsDto, mockResponse),
//       ).rejects.toThrowError(mockError);
//       expect(authService.login).toHaveBeenCalledWith(credentialsDto);
//       expect(mockResponse.status).toHaveBeenCalledWith(401);
//       expect(mockResponse.json).toHaveBeenCalledWith({
//         statusCode: 401,
//         message: 'Invalid credentials',
//       });
//     });
//   });
// });

// // ----- service
// describe('AuthService', () => {
//   let authService: AuthService;
//   let usersService: UsersService;

//   beforeEach(async () => {
//     const moduleRef = await Test.createTestingModule({
//       providers: [
//         AuthService,
//         {
//           provide: UsersService,
//           useValue: {
//             getUserByMec: jest.fn(),
//           },
//         },
//       ],
//     }).compile();

//     authService = moduleRef.get<AuthService>(AuthService);
//     usersService = moduleRef.get<UsersService>(UsersService);
//   });

//   describe('login', () => {
//     it('should throw an UnauthorizedException if the username is not a number', async () => {
//       const credentialsDto: LoginCredentialsDto = {
//         username: 'invalid_username',
//         password: 'testpassword',
//       };

//       await expect(authService.login(credentialsDto)).rejects.toThrowError(UnauthorizedException);
//     });

//     it('should throw an UnauthorizedException if the user cannot be found', async () => {
//       const credentialsDto: LoginCredentialsDto = {
//         username: '123456',
//         password: 'testpassword',
//       };

//       jest
