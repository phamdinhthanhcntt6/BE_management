import {
  Body,
  Controller,
  Get,
  Path,
  Post,
  Put,
  Route,
  Security,
  Tags,
} from "tsoa";
import { Request, Response } from "express";
import { generateToken } from "../utils/generateToken";
import User from "../models/user";
import bcrypt from "bcryptjs";

interface UserResponse {
  id: string;
  name: string;
  email: string;
  role: string;
  token: string;
}

interface LoginRequest {
  email: string;
  password: string;
}

interface RegisterRequest {
  name: string;
  email: string;
  password: string;
}

interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
}

@Route("auth")
@Tags("Auth")
export class UserController extends Controller {
  /**
   * Register new user
   */
  @Post("register")
  public async register(
    @Body() requestBody: RegisterRequest
  ): Promise<UserResponse> {
    try {
      // Check if user already exists
      const existingUser = await User.findOne({ email: requestBody.email });
      if (existingUser) {
        throw new Error("User already exists");
      }

      // Hash password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(requestBody.password, salt);

      // Create user
      const user = await User.create({
        name: requestBody.name,
        email: requestBody.email,
        password: hashedPassword,
        role: "user",
      });

      const token = generateToken(user._id.toString());

      return {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        role: user.role,
        token,
      };
    } catch (error: any) {
      throw new Error(error.message);
    }
  }

  /**
   * Login with email and password
   */
  @Post("login")
  public async login(@Body() requestBody: LoginRequest): Promise<UserResponse> {
    try {
      // Find user by email
      const user = await User.findOne({ email: requestBody.email });
      if (!user) {
        throw new Error("Invalid email or password");
      }

      // Check password
      const isPasswordValid = await bcrypt.compare(
        requestBody.password,
        user.password
      );
      if (!isPasswordValid) {
        throw new Error("Invalid email or password");
      }

      const token = generateToken(user._id.toString());

      return {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        role: user.role,
        token,
      };
    } catch (error: any) {
      throw new Error(error.message);
    }
  }

  /**
   * Get current user profile
   */
  @Get("me")
  @Security("bearerAuth")
  public async getMe(): Promise<UserResponse> {
    // Giả lập logic lấy thông tin user
    return {
      id: "user123",
      name: "Test User",
      email: "user@example.com",
      role: "user",
      token: "",
    };
  }

  /**
   * Update user profile
   */
  @Put("update/{userId}")
  @Security("bearerAuth")
  public async updateUser(
    @Path() userId: string,
    @Body() requestBody: { name?: string; email?: string }
  ): Promise<UserResponse> {
    try {
      const user = await User.findByIdAndUpdate(
        userId,
        {
          ...(requestBody.name && { name: requestBody.name }),
          ...(requestBody.email && { email: requestBody.email }),
        },
        { new: true }
      ).select("-password");

      if (!user) {
        throw new Error("User not found");
      }

      return {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        role: user.role,
        token: "",
      };
    } catch (error: any) {
      throw new Error(error.message);
    }
  }

  /**
   * Change user password
   */
  @Post("change-password")
  @Security("bearerAuth")
  public async changePassword(
    @Body() requestBody: ChangePasswordRequest
  ): Promise<{ message: string }> {
    try {
      // This would normally get the user ID from the authenticated request
      // For now, using a placeholder
      const userId = "user123";

      const user = await User.findById(userId);
      if (!user) {
        throw new Error("User not found");
      }

      // Check current password
      const isCurrentPasswordValid = await bcrypt.compare(
        requestBody.currentPassword,
        user.password
      );
      if (!isCurrentPasswordValid) {
        throw new Error("Current password is incorrect");
      }

      // Hash new password
      const salt = await bcrypt.genSalt(10);
      const hashedNewPassword = await bcrypt.hash(
        requestBody.newPassword,
        salt
      );

      // Update password
      await User.findByIdAndUpdate(userId, { password: hashedNewPassword });

      return { message: "Password changed successfully" };
    } catch (error: any) {
      throw new Error(error.message);
    }
  }
}

// Create instance of controller for standalone function exports
const userController = new UserController();

// Export standalone functions for Express router compatibility
export const register = async (req: Request, res: Response) => {
  try {
    const result = await userController.register(req.body);
    res.status(201).json(result);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const result = await userController.login(req.body);
    res.status(200).json(result);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const getMe = async (req: Request, res: Response) => {
  try {
    const result = await userController.getMe();
    res.status(200).json(result);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const updateUser = async (req: Request, res: Response) => {
  try {
    const result = await userController.updateUser(req.params.id, req.body);
    res.status(200).json(result);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const changePassword = async (req: Request, res: Response) => {
  try {
    const result = await userController.changePassword(req.body);
    res.status(200).json(result);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};
