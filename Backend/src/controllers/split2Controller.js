const Split2Section = require('../models/Split2Section')

const getSplit2 = async (req, res) => {
  let data = await Split2Section.findOne()
  if (!data) {
    data = await Split2Section.create({
      eyebrow: 'Exclusive Designs',
      heading: 'STYLE YOUR OWN WAY',
      description: 'Apni personality ko express karo. Har design unique hai, har piece ek statement. Premium fabric ke saath unmatched comfort.',
      btn1: 'Explore Now',
      btn2: 'Learn More',
      videoUrl: '',
      features: [
        { title: 'Material', value: 'Premium Blend' },
        { title: 'Colors', value: '20+ Options' },
        { title: 'Sizes', value: 'XS to 3XL' },
        { title: 'Print', value: 'HD Quality' },
      ]
    })
  }
  res.json(data)
}

const updateSplit2 = async (req, res) => {
  let data = await Split2Section.findOne()
  if (!data) data = new Split2Section()
  Object.assign(data, req.body)
  await data.save()
  res.json(data)
}

module.exports = { getSplit2, updateSplit2 }
