const SplitSection = require('../models/SplitSection')

const getSplitSection = async (req, res) => {
  let data = await SplitSection.findOne()
  if (!data) {
    data = await SplitSection.create({
      eyebrow: 'Premium Collection',
      heading: '3D CUSTOM T-SHIRT',
      description: 'Aapka design, hamari quality. 3D environment ke saath apne T-shirt designs ko visualize karein aur professional look dein.',
      btn1: 'Customize Now',
      btn2: 'View Details',
      features: [
        { title: 'Fabric', value: '100% Organic Cotton' },
        { title: 'Fit', value: 'Oversized / Regular' },
        { title: 'Delivery', value: '3–5 Business Days' },
        { title: 'Returns', value: 'Easy 7-Day Return' },
      ]
    })
  }
  res.json(data)
}

const updateSplitSection = async (req, res) => {
  let data = await SplitSection.findOne()
  if (!data) data = new SplitSection()
  Object.assign(data, req.body)
  await data.save()
  res.json(data)
}

module.exports = { getSplitSection, updateSplitSection }
