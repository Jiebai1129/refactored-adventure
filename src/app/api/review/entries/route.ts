import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// 创建新的复习条目
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { mistakeId, oldMasteryLevel, newMasteryLevel, sessionId } = body;
    
    if (!mistakeId || oldMasteryLevel === undefined || newMasteryLevel === undefined || !sessionId) {
      return NextResponse.json({ error: '缺少必要字段' }, { status: 400 });
    }
    
    // 创建复习条目
    const entry = await prisma.reviewEntry.create({
      data: {
        mistakeId,
        oldMasteryLevel,
        newMasteryLevel,
        sessionId,
      },
    });
    
    // 更新错题的掌握程度
    await prisma.mistake.update({
      where: { id: mistakeId },
      data: {
        masteryLevel: newMasteryLevel,
        reviewedAt: new Date(),
      },
    });
    
    // 更新会话的复习数量
    await prisma.reviewSession.update({
      where: { id: sessionId },
      data: {
        mistakesReviewed: {
          increment: 1,
        },
      },
    });
    
    return NextResponse.json(entry);
  } catch (error) {
    console.error('创建复习条目失败:', error);
    return NextResponse.json({ error: '创建复习条目失败' }, { status: 500 });
  }
} 