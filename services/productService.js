const prisma = require('../config/db');
const ApiError = require('../utils/ApiError');
const logger = require('../utils/logger');
const { uploadToCloudinary } = require('../utils/cloudinary');

const createProduct = async (productData, sellerId, files = []) => {
  try {
    // Handle image uploads
    const imageUrls = await Promise.all(
      files.map(file => uploadToCloudinary(file.path))
    );

    const images = {
      main: imageUrls[0]?.secure_url || null,
      others: imageUrls.slice(1).map(img => img.secure_url)
    };

    // Create product with categories
    const product = await prisma.product.create({
      data: {
        ...productData,
        sellerId,
        images,
        categories: productData.categories && {
          connectOrCreate: productData.categories.map(name => ({
            where: { name },
            create: { name }
          }))
        }
      },
      include: {
        seller: {
          select: {
            id: true,
            name: true,
            hostel: true
          }
        },
        categories: true
      }
    });

    logger.info(`Product created: ${product.id} by user ${sellerId}`);
    return product;
  } catch (error) {
    logger.error('Product creation failed', error);
    throw new ApiError(500, 'Failed to create product');
  }
};

const getProducts = async (query = {}) => {
  try {
    const { category, status, minPrice, maxPrice, sort, limit = 10, page = 1 } = query;

    const where = {
      status: status || 'ACTIVE',
      ...(category && { categories: { some: { name: category } } }),
      ...(minPrice && { price: { gte: parseFloat(minPrice) } }),
      ...(maxPrice && { price: { lte: parseFloat(maxPrice) } })
    };

    const orderBy = sort 
      ? { [sort.split(':')[0]]: sort.split(':')[1] } 
      : { createdAt: 'desc' };

    const products = await prisma.product.findMany({
      where,
      skip: (page - 1) * limit,
      take: parseInt(limit),
      orderBy,
      include: {
        seller: {
          select: {
            id: true,
            name: true,
            hostel: true
          }
        },
        categories: true
      }
    });

    const total = await prisma.product.count({ where });

    return {
      products,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(total / limit)
      }
    };
  } catch (error) {
    logger.error('Failed to fetch products', error);
    throw new ApiError(500, 'Failed to fetch products');
  }
};

const getProductById = async (productId) => {
  try {
    const product = await prisma.product.findUnique({
      where: { id: productId },
      include: {
        seller: {
          select: {
            id: true,
            name: true,
            email: true,
            hostel: true
          }
        },
        categories: true
      }
    });

    if (!product) {
      throw new ApiError(404, 'Product not found');
    }

    return product;
  } catch (error) {
    logger.error(`Failed to fetch product ${productId}`, error);
    throw error;
  }
};

const updateProduct = async (productId, updateData, userId, role, files = []) => {
  try {
    // Verify ownership or admin status
    const existingProduct = await prisma.product.findUnique({
      where: { id: productId }
    });

    if (!existingProduct) {
      throw new ApiError(404, 'Product not found');
    }

    if (existingProduct.sellerId !== userId && role !== 'ADMIN') {
      throw new ApiError(403, 'Not authorized to update this product');
    }

    // Handle image updates if files are provided
    let images = existingProduct.images;
    if (files.length > 0) {
      const imageUrls = await Promise.all(
        files.map(file => uploadToCloudinary(file.path))
      );
      images = {
        main: imageUrls[0]?.secure_url || images.main,
        others: imageUrls.slice(1).map(img => img.secure_url) || images.others
      };
    }

    const updatedProduct = await prisma.product.update({
      where: { id: productId },
      data: {
        ...updateData,
        images,
        ...(updateData.categories && {
          categories: {
            set: [],
            connectOrCreate: updateData.categories.map(name => ({
              where: { name },
              create: { name }
            }))
          }
        })
      },
      include: {
        categories: true
      }
    });

    logger.info(`Product updated: ${productId} by user ${userId}`);
    return updatedProduct;
  } catch (error) {
    logger.error(`Failed to update product ${productId}`, error);
    throw error;
  }
};

const deleteProduct = async (productId, userId, role) => {
  try {
    const product = await prisma.product.findUnique({
      where: { id: productId }
    });

    if (!product) {
      throw new ApiError(404, 'Product not found');
    }

    if (product.sellerId !== userId && role !== 'ADMIN') {
      throw new ApiError(403, 'Not authorized to delete this product');
    }

    await prisma.product.delete({
      where: { id: productId }
    });

    logger.info(`Product deleted: ${productId} by user ${userId}`);
    return true;
  } catch (error) {
    logger.error(`Failed to delete product ${productId}`, error);
    throw error;
  }
};

const getUserProducts = async (userId) => {
  try {
    const products = await prisma.product.findMany({
      where: { sellerId: userId },
      orderBy: { createdAt: 'desc' },
      include: {
        categories: true
      }
    });

    return products;
  } catch (error) {
    logger.error(`Failed to fetch products for user ${userId}`, error);
    throw new ApiError(500, 'Failed to fetch user products');
  }
};

module.exports = {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  getUserProducts
};