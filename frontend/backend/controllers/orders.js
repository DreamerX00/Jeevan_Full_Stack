// @desc    Get logged in user orders
// @route   GET /api/orders/myorders
// @access  Private
exports.getUserOrders = asyncHandler(async (req, res) => {
  const orders = await Order.findAll({
    where: { userId: req.user.id },
    include: [{ model: OrderItem }],
    order: [['createdAt', 'DESC']]
  });
  
  res.json(orders);
}); 