import { Router, Request, Response } from 'express';
import { authService } from '../services/auth.service';
import { generateToken, authenticate, AuthRequest } from '../middleware/auth.middleware';

const router = Router();

// POST /api/auth/register
router.post('/register', async (req: Request, res: Response) => {
  try {
    const { email, password, name } = req.body;

    // Validation
    if (!email || !password || !name) {
      return res.status(400).json({
        success: false,
        error: 'Vui lòng nhập đầy đủ thông tin',
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        error: 'Mật khẩu phải có ít nhất 6 ký tự',
      });
    }

    // Check if email already exists
    const existingUser = await authService.findUserByEmail(email);
    if (existingUser) {
      return res.status(400).json({
        success: false,
        error: 'Email đã được sử dụng',
      });
    }

    // Create user
    const user = await authService.createUser({ email, password, name });

    // Generate token
    const token = generateToken({
      userId: user.id,
      email: user.email,
      role: user.role,
    });

    res.status(201).json({
      success: true,
      data: {
        user,
        token,
      },
      message: 'Đăng ký thành công',
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({
      success: false,
      error: 'Đăng ký thất bại. Vui lòng thử lại.',
    });
  }
});

// POST /api/auth/login
router.post('/login', async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        error: 'Vui lòng nhập email và mật khẩu',
      });
    }

    // Find user
    const user = await authService.findUserByEmail(email);
    if (!user) {
      return res.status(401).json({
        success: false,
        error: 'Email hoặc mật khẩu không đúng',
      });
    }

    // Check if user is active
    if (!user.isActive) {
      return res.status(401).json({
        success: false,
        error: 'Tài khoản đã bị vô hiệu hóa',
      });
    }

    // Validate password
    const isValidPassword = await authService.validatePassword(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({
        success: false,
        error: 'Email hoặc mật khẩu không đúng',
      });
    }

    // Generate token
    const token = generateToken({
      userId: user.id,
      email: user.email,
      role: user.role,
    });

    res.json({
      success: true,
      data: {
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          isActive: user.isActive,
          createdAt: user.createdAt,
        },
        token,
      },
      message: 'Đăng nhập thành công',
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      error: 'Đăng nhập thất bại. Vui lòng thử lại.',
    });
  }
});

// GET /api/auth/me - Get current user
router.get('/me', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const user = await authService.findUserById(req.user!.userId);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'Không tìm thấy người dùng',
      });
    }

    res.json({
      success: true,
      data: user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Lỗi lấy thông tin người dùng',
    });
  }
});

// PUT /api/auth/profile - Update profile
router.put('/profile', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const { name, email } = req.body;
    const userId = req.user!.userId;

    // Check if new email is already taken
    if (email && email !== req.user!.email) {
      const existingUser = await authService.findUserByEmail(email);
      if (existingUser) {
        return res.status(400).json({
          success: false,
          error: 'Email đã được sử dụng',
        });
      }
    }

    const updatedUser = await authService.updateUser(userId, { name, email });

    if (!updatedUser) {
      return res.status(404).json({
        success: false,
        error: 'Không tìm thấy người dùng',
      });
    }

    res.json({
      success: true,
      data: updatedUser,
      message: 'Cập nhật thông tin thành công',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Cập nhật thông tin thất bại',
    });
  }
});

// PUT /api/auth/change-password
router.put('/change-password', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const userId = req.user!.userId;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        error: 'Vui lòng nhập đầy đủ thông tin',
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        error: 'Mật khẩu mới phải có ít nhất 6 ký tự',
      });
    }

    // Get current user
    const user = await authService.findUserByEmail(req.user!.email);
    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'Không tìm thấy người dùng',
      });
    }

    // Validate current password
    const isValidPassword = await authService.validatePassword(currentPassword, user.password);
    if (!isValidPassword) {
      return res.status(400).json({
        success: false,
        error: 'Mật khẩu hiện tại không đúng',
      });
    }

    // Update password
    await authService.updateUser(userId, { password: newPassword });

    res.json({
      success: true,
      message: 'Đổi mật khẩu thành công',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Đổi mật khẩu thất bại',
    });
  }
});

export default router;
