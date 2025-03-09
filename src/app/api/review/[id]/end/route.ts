import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// 结束复习会话
export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    
    // 检查会话是否存在
    const session = await prisma.reviewSession.findUnique({
      where: { id },
    });
    
    if (!session) {
      return NextResponse.json({ error: '复习会话不存在' }, { status: 404 });
    }
    
    // 更新会话结束时间
    const updatedSession = await prisma.reviewSession.update({
      where: { id },
      data: {
        endTime: new Date(),
      },
    });
    
    return NextResponse.json(updatedSession);
  } catch (error) {
    console.error('结束复习会话失败:', error);
    return NextResponse.json({ error: '结束复习会话失败' }, { status: 500 });
  }
} 