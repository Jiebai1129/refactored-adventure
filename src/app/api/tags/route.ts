import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// 获取所有标签
export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const userId = url.searchParams.get('userId');
    
    if (!userId) {
      return NextResponse.json({ error: '缺少用户ID' }, { status: 400 });
    }
    
    const tags = await prisma.tag.findMany({
      where: { userId },
      orderBy: { name: 'asc' },
    });
    
    return NextResponse.json(tags);
  } catch (error) {
    console.error('获取标签失败:', error);
    return NextResponse.json({ error: '获取标签失败' }, { status: 500 });
  }
}

// 创建新标签
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, userId } = body;
    
    if (!name || !userId) {
      return NextResponse.json({ error: '缺少必要字段' }, { status: 400 });
    }
    
    // 检查是否已存在同名标签
    const existingTag = await prisma.tag.findFirst({
      where: {
        name,
        userId,
      },
    });
    
    if (existingTag) {
      return NextResponse.json({ error: '标签已存在' }, { status: 409 });
    }
    
    // 创建标签
    const tag = await prisma.tag.create({
      data: {
        name,
        userId,
      },
    });
    
    return NextResponse.json(tag);
  } catch (error) {
    console.error('创建标签失败:', error);
    return NextResponse.json({ error: '创建标签失败' }, { status: 500 });
  }
} 