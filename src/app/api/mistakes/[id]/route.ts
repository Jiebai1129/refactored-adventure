import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// 获取单个错题
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    
    const mistake = await prisma.mistake.findUnique({
      where: { id },
      include: {
        tags: {
          include: {
            tag: true,
          },
        },
      },
    });
    
    if (!mistake) {
      return NextResponse.json({ error: '错题不存在' }, { status: 404 });
    }
    
    // 转换数据结构
    const formattedMistake = {
      ...mistake,
      tags: mistake.tags.map(mt => mt.tag),
    };
    
    return NextResponse.json(formattedMistake);
  } catch (error) {
    console.error('获取错题失败:', error);
    return NextResponse.json({ error: '获取错题失败' }, { status: 500 });
  }
}

// 更新错题
export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const body = await req.json();
    const { content, correctAnswer, explanation, errorReason, imageUrl, masteryLevel, tags } = body;
    
    // 检查错题是否存在
    const existingMistake = await prisma.mistake.findUnique({
      where: { id },
    });
    
    if (!existingMistake) {
      return NextResponse.json({ error: '错题不存在' }, { status: 404 });
    }
    
    // 更新错题基本信息
    const updatedMistake = await prisma.mistake.update({
      where: { id },
      data: {
        content,
        correctAnswer,
        explanation,
        errorReason,
        imageUrl,
        masteryLevel: masteryLevel !== undefined ? masteryLevel : existingMistake.masteryLevel,
        updatedAt: new Date(),
      },
    });
    
    // 如果提供了标签，更新标签关联
    if (tags) {
      // 删除现有标签关联
      await prisma.mistakeTag.deleteMany({
        where: { mistakeId: id },
      });
      
      // 创建新的标签关联
      if (tags.length > 0) {
        const tagConnections = tags.map((tagId: string) => ({
          tagId,
          mistakeId: id,
        }));
        
        await prisma.mistakeTag.createMany({
          data: tagConnections,
        });
      }
    }
    
    // 获取更新后的完整错题
    const completeUpdatedMistake = await prisma.mistake.findUnique({
      where: { id },
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
      ...completeUpdatedMistake,
      tags: completeUpdatedMistake?.tags.map(mt => mt.tag) || [],
    };
    
    return NextResponse.json(formattedMistake);
  } catch (error) {
    console.error('更新错题失败:', error);
    return NextResponse.json({ error: '更新错题失败' }, { status: 500 });
  }
}

// 删除错题
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    
    // 检查错题是否存在
    const existingMistake = await prisma.mistake.findUnique({
      where: { id },
    });
    
    if (!existingMistake) {
      return NextResponse.json({ error: '错题不存在' }, { status: 404 });
    }
    
    // 删除错题（级联删除会自动删除相关的标签关联）
    await prisma.mistake.delete({
      where: { id },
    });
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('删除错题失败:', error);
    return NextResponse.json({ error: '删除错题失败' }, { status: 500 });
  }
} 