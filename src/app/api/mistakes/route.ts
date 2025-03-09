import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// 获取所有错题
export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const userId = url.searchParams.get('userId');
    
    if (!userId) {
      return NextResponse.json({ error: '缺少用户ID' }, { status: 400 });
    }
    
    const mistakes = await prisma.mistake.findMany({
      where: { userId },
      include: {
        tags: {
          include: {
            tag: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
    
    // 转换数据结构以匹配前端期望的格式
    const formattedMistakes = mistakes.map(mistake => ({
      ...mistake,
      tags: mistake.tags.map(mt => mt.tag),
    }));
    
    return NextResponse.json(formattedMistakes);
  } catch (error) {
    console.error('获取错题失败:', error);
    return NextResponse.json({ error: '获取错题失败' }, { status: 500 });
  }
}

// 创建新错题
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { content, correctAnswer, explanation, errorReason, imageUrl, userId, tags } = body;
    
    if (!content || !correctAnswer || !userId) {
      return NextResponse.json({ error: '缺少必要字段' }, { status: 400 });
    }
    
    // 创建错题
    const mistake = await prisma.mistake.create({
      data: {
        content,
        correctAnswer,
        explanation,
        errorReason,
        imageUrl,
        userId,
      },
    });
    
    // 如果有标签，创建关联
    if (tags && tags.length > 0) {
      const tagConnections = tags.map((tagId: string) => ({
        tagId,
        mistakeId: mistake.id,
      }));
      
      await prisma.mistakeTag.createMany({
        data: tagConnections,
      });
    }
    
    // 获取包含标签的完整错题
    const createdMistake = await prisma.mistake.findUnique({
      where: { id: mistake.id },
      include: {
        tags: {
          include: {
            tag: true,
          },
        },
      },
    });
    
    // 转换数据结构
    const formattedMistake = {
      ...createdMistake,
      tags: createdMistake?.tags.map(mt => mt.tag) || [],
    };
    
    return NextResponse.json(formattedMistake);
  } catch (error) {
    console.error('创建错题失败:', error);
    return NextResponse.json({ error: '创建错题失败' }, { status: 500 });
  }
} 