import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting database seed...')

  // Create default subscription plans
  const plans = await Promise.all([
    prisma.subscriptionPlan.upsert({
      where: { id: 'basic' },
      update: {},
      create: {
        id: 'basic',
        name: 'Basic',
        description: 'Essential features for small laboratories',
        price: 99,
        interval: 'month',
        features: ['Equipment Management', 'Basic Calibration', 'Standard Support'],
        maxUsers: 5,
        maxEquipment: 20
      }
    }),
    prisma.subscriptionPlan.upsert({
      where: { id: 'professional' },
      update: {},
      create: {
        id: 'professional',
        name: 'Professional',
        description: 'Advanced features for growing laboratories',
        price: 199,
        interval: 'month',
        features: ['Advanced Analytics', 'AI Assistant', 'Priority Support', 'Custom Integrations'],
        maxUsers: 15,
        maxEquipment: 100
      }
    }),
    prisma.subscriptionPlan.upsert({
      where: { id: 'enterprise' },
      update: {},
      create: {
        id: 'enterprise',
        name: 'Enterprise',
        description: 'Complete solution for large organizations',
        price: 399,
        interval: 'month',
        features: ['Unlimited Users', 'Unlimited Equipment', 'Dedicated Support', 'Custom Development'],
        maxUsers: -1,
        maxEquipment: -1
      }
    })
  ])

  console.log('✅ Database seeded successfully!')
  console.log('📊 Created:')
  console.log(`   - ${plans.length} Subscription Plans`)
  console.log('')
  console.log('🚀 Ready for production use!')
  console.log('   Users can now register and create their own laboratories.')
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  }) 