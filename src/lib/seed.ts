const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('Seeding data...');

  // 1. Clients
  const clients = [
    { name: 'Jean Dupont', email: 'jean.dupont@elevage-canin.fr', phone: '06 12 34 56 78', address: '12 rue des Alpes, 69000 Lyon', notes: 'Client régulier pour transports canins.' },
    { name: 'TechCorp Solutions', email: 'contact@techcorp.com', phone: '01 45 67 89 00', address: '45 Avenue de la République, 75011 Paris', notes: 'Expertise automatisation CRM.' },
    { name: 'Sophie Martin', email: 's.martin@reptile-asso.org', phone: '07 88 99 00 11', address: '5 Square de la Libération, 38000 Grenoble', notes: 'Association reptilienne.' },
  ];

  for (const client of clients) {
    await prisma.client.upsert({
      where: { id: client.name.replace(/\s+/g, '-').toLowerCase() }, // Pseudo-id reproducible for seed
      update: {},
      create: { 
        id: client.name.replace(/\s+/g, '-').toLowerCase(),
        ...client 
      }
    });
  }

  // 2. Settings
  await prisma.pricingSettings.upsert({
    where: { id: 'default-settings' },
    update: {},
    create: {
      id: 'default-settings',
      hourlyRate: 60,
      travelHourlyRate: 35,
      fuelPriceDefault: 1.85,
      complexityCoeffs: JSON.stringify({ basic: 1, medium: 1.3, high: 1.8 }),
      multiToolCoeffs: JSON.stringify({ base: 1.1 }),
      multiIACoeffs: JSON.stringify({ base: 1.25 }),
      riskCoeffs: JSON.stringify({ low: 1, med: 1.2, high: 1.5 }),
    }
  });

  // 3. Quotes (Basic examples)
  const jean = await prisma.client.findFirst({ where: { name: 'Jean Dupont' } });
  if (jean) {
    await prisma.quote.create({
      data: {
        title: 'Transport Chiot Lyon-Paris',
        type: 'DELIVERY',
        status: 'PAID',
        totalAmount: 450,
        subtotalAmount: 450,
        clientId: jean.id,
        calculationDetail: JSON.stringify({ distance: 450, duration: 5 }),
      }
    });
  }

  const tech = await prisma.client.findFirst({ where: { name: 'TechCorp Solutions' } });
  if (tech) {
    await prisma.quote.create({
      data: {
        title: 'Audit Automation CRM',
        type: 'AUTOMATION',
        status: 'SENT',
        totalAmount: 2800,
        subtotalAmount: 2800,
        clientId: tech.id,
        calculationDetail: JSON.stringify({ hours: 40, complexity: 1.2 }),
      }
    });
  }

  // 4. Diagrams
  await prisma.diagram.create({
    data: {
      title: 'Flux de Livraison Standard',
      sourceText: "Réception commande\nPréparation cage\nTrajet\nRemise client",
      mermaidCode: "graph TD\n  START[Début] --> N1[Réception commande]\n  N1 --> N2[Préparation cage]\n  N2 --> N3[Trajet]\n  N3 --> N4[Remise client]\n  N4 --> END[Fin]",
    }
  });

  console.log('Seeding finished!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
