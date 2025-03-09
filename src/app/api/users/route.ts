import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// 获取用户
export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const email = url.searchParams.get('email');
    
    if (!email) {
      return NextResponse.json({ error: '缺少邮箱参数' }, { status: 400 });
    }
    
    const user = await prisma.user.findUnique({
      where: { email },
    });
    
    if (!user) {
      return NextResponse.json({ error: '用户不存在' }, { status: 404 });
    }
    
    return NextResponse.json(user);
  } catch (error) {
    console.error('获取用户失败:', error);
    return NextResponse.json({ error: '获取用户失败' }, { status: 500 });
  }
}

// 创建用户
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email } = body;
    
    if (!email) {
      return NextResponse.json({ error: '缺少必要字段' }, { status: 400 });
    }
    
    // 检查用户是否已存在
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });
    
    if (existingUser) {
      return NextResponse.json(existingUser);
    }
    
    // 创建新用户
    const user = await prisma.user.create({
      data: {
        name,
        email,
      },
    });
    
    return NextResponse.json(user);
  } catch (error) {
    console.error('创建用户失败:', error);
    return NextResponse.json({ error: '创建用户失败' }, { status: 500 });
  }
} 