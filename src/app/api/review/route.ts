import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// 创建新的复习会话
export async function POST(req: NextRequest) {
  try {
    // 创建新的复习会话
    const session = await prisma.reviewSession.create({
      data: {},
    });
    
    return NextResponse.json(session);
  } catch (error) {
    console.error('创建复习会话失败:', error);
    return NextResponse.json({ error: '创建复习会话失败' }, { status: 500 });
  }
}

// 获取复习会话
export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const sessionId = url.searchParams.get('sessionId');
    
    if (sessionId) {
      // 获取特定会话
      const session = await prisma.reviewSession.findUnique({
        where: { id: sessionId },
        include: {
          reviewEntries: true,
        },
      });
      
      if (!session) {
        return NextResponse.json({ error: '复习会话不存在' }, { status: 404 });
      }
      
      return NextResponse.json(session);
    } else {
      // 获取所有会话
      const sessions = await prisma.reviewSession.findMany({
        orderBy: { startTime: 'desc' },
        include: {
          reviewEntries: true,
        },
      });
      
      return NextResponse.json(sessions);
    }
  } catch (error) {
    console.error('获取复习会话失败:', error);
    return NextResponse.json({ error: '获取复习会话失败' }, { status: 500 });
  }
} 