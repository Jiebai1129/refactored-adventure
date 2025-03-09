import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// 更新标签
export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const body = await req.json();
    const { name } = body;
    
    if (!name) {
      return NextResponse.json({ error: '缺少必要字段' }, { status: 400 });
    }
    
    // 检查标签是否存在
    const existingTag = await prisma.tag.findUnique({
      where: { id },
    });
    
    if (!existingTag) {
      return NextResponse.json({ error: '标签不存在' }, { status: 404 });
    }
    
    // 检查是否已存在同名标签（排除当前标签）
    const duplicateTag = await prisma.tag.findFirst({
      where: {
        name,
        userId: existingTag.userId,
        id: { not: id },
      },
    });
    
    if (duplicateTag) {
      return NextResponse.json({ error: '标签名已存在' }, { status: 409 });
    }
    
    // 更新标签
    const updatedTag = await prisma.tag.update({
      where: { id },
      data: { name },
    });
    
    return NextResponse.json(updatedTag);
  } catch (error) {
    console.error('更新标签失败:', error);
    return NextResponse.json({ error: '更新标签失败' }, { status: 500 });
  }
}

// 删除标签
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    
    // 检查标签是否存在
    const existingTag = await prisma.tag.findUnique({
      where: { id },
    });
    
    if (!existingTag) {
      return NextResponse.json({ error: '标签不存在' }, { status: 404 });
    }
    
    // 删除标签（级联删除会自动删除相关的错题标签关联）
    await prisma.tag.delete({
      where: { id },
    });
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('删除标签失败:', error);
    return NextResponse.json({ error: '删除标签失败' }, { status: 500 });
  }
} 