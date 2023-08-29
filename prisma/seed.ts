/**
 * Adds seed data to your db
 *
 * @link https://www.prisma.io/docs/guides/database/seed-database
 */
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // ==================== CARS ====================
  await prisma.manufacturer.upsert({
    where: { name: 'Porsche' },
    update: {},
    create: {
      name: 'Porsche',
      yearFounded: 1931,
      headquarters: 'Stuttgart, Germany',
      image: 'Manufacturer Logos/ade8lirdltnxldftlkl7',
      models: {
        createMany: {
          data: [
            { name: "911 Carrera RS (901) '73" },
            {
              id: 'f1d7b3e1-233d-4121-91b4-a8258195e291',
              name: "911 Turbo (930) '81",
            },
            { name: "911 Carrera RS (964) '92" },
            { name: "911 Carrera RS Club Sport (993) '95" },
            { name: "911 GT3 (996) '01" },
            { name: "911 GT3 (997) '09" },
          ],
        },
      },
    },
  });
  await prisma.manufacturer.upsert({
    where: { name: 'Ferrari' },
    update: {},
    create: {
      name: 'Ferrari',
      yearFounded: 1939,
      headquarters: 'Maranello, Emilia-Romagna, Italy',
      image: 'Manufacturer Logos/ml8tlzpem2weqq0kz5ep',
      models: {
        createMany: {
          data: [{ name: "F40 '92" }],
        },
      },
    },
  });
  await prisma.manufacturer.upsert({
    where: { name: 'Nissan' },
    update: {},
    create: {
      name: 'Nissan',
      yearFounded: 1933,
      headquarters: 'Nishi-ku, Yokohama, Japan',
      image: 'Manufacturer Logos/qk6ajv1yhbhqvnkesfvk',
      models: {
        createMany: {
          data: [{ name: "Skyline GT-R V･spec II Nür (R34) '02" }],
        },
      },
    },
  });
  await prisma.manufacturer.upsert({
    where: { name: 'Chevrolet' },
    update: {},
    create: {
      name: 'Chevrolet',
      yearFounded: 1911,
      headquarters: 'Detroit, Michigan, U.S.',
      image: 'Manufacturer Logos/pbjemrxjtwubqbrxealy',
      models: {
        createMany: {
          data: [{ name: 'Corvette' }],
        },
      },
    },
  });
  await prisma.manufacturer.upsert({
    where: { name: 'BMW' },
    update: {},
    create: {
      name: 'BMW',
      yearFounded: 1916,
      headquarters: 'Munich, Germany',
      image: 'Manufacturer Logos/irzmzgrr3ax0r0sbqgb1',
      models: {
        createMany: {
          data: [{ name: 'M3' }],
        },
      },
    },
  });
  await prisma.manufacturer.upsert({
    where: { name: 'Toyota' },
    update: {},
    create: {
      name: 'Toyota',
      yearFounded: 1937,
      headquarters: 'Toyota City, Aichi, Japan',
      image: 'Manufacturer Logos/s814k6fqsntc3mpq76fm',
      models: {
        createMany: {
          data: [{ name: 'Supra' }],
        },
      },
    },
  });
  await prisma.manufacturer.upsert({
    where: { name: 'Lamborghini' },
    update: {},
    create: {
      name: 'Lamborghini',
      yearFounded: 1963,
      headquarters: "Sant'Agata Bolognese, Emilia-Romagna, Italy",
      image: 'Manufacturer Logos/jdjomfimaip35gk0voe9',
      models: {
        createMany: {
          data: [{ name: 'Huracan' }],
        },
      },
    },
  });
  await prisma.manufacturer.upsert({
    where: { name: 'Volkswagen' },
    update: {},
    create: {
      name: 'Volkswagen',
      yearFounded: 1937,
      headquarters: 'Wolfsburg, Germany',
      image: 'Manufacturer Logos/dkw8kuvzvnioipxfl35o',
      models: {
        createMany: {
          data: [{ name: 'IDR' }],
        },
      },
    },
  });
  await prisma.manufacturer.upsert({
    where: { name: 'Super Formula' },
    update: {},
    create: {
      name: 'Super Formula',
      yearFounded: 1973,
      headquarters: 'Japan',
      image: 'Manufacturer Logos/nuqyrvcpqxmwyq26dvsw',
      models: {
        createMany: {
          data: [{ name: 'Honda' }],
        },
      },
    },
  });
  await prisma.manufacturer.upsert({
    where: { name: 'RE Amemiya' },
    update: {},
    create: {
      name: 'RE Amemiya',
      yearFounded: 1974,
      headquarters: 'Tomisato, Japan',
      image: 'Manufacturer Logos/okylbfgijtwobpvyzz0u',
      models: {
        createMany: {
          data: [{ name: 'RX7' }],
        },
      },
    },
  });

  // ==================== TRACKS ====================
  await prisma.track.upsert({
    where: { name: 'Tokyo Expressway' },
    update: {},
    create: {
      name: 'Tokyo Expressway',
      location: 'Tokyo, Japan',
      trackLayouts: {
        createMany: {
          data: [
            { name: 'Central Inner Loop' },
            { name: 'Central Outer Loop' },
            { name: 'East Inner Loop' },
            { name: 'East Outer Loop' },
            { name: 'South Inner Loop' },
            { name: 'South Outer Loop' },
          ],
        },
      },
    },
  });
  await prisma.track.upsert({
    where: { name: 'Grand Valley' },
    update: {},
    create: {
      name: 'Grand Valley',
      location: 'Big Sur, California, USA',
      trackLayouts: {
        createMany: {
          data: [{ name: 'Highway 1' }, { name: 'South' }],
        },
      },
    },
  });
  await prisma.track.upsert({
    where: { name: 'Michelin Raceway Road Atlanta' },
    update: {},
    create: {
      name: 'Michelin Raceway Road Atlanta',
      location: 'Braselton, Georgia, United States',
      trackLayouts: {
        createMany: {
          data: [{ name: 'Full Course' }],
        },
      },
    },
  });

  // ==================== LOBBY SETTINGS ====================
  // *****IMPORTANT*****
  // Make sure to make a user through the website and
  // replace the userId below with the new user's userId.
  // for (let i = 0; i < 100; i++) {
  //   await prisma.lobbySettings.upsert({
  //     where: {
  //       id: String(i),
  //     },
  //     create: {
  //       title: `${i} Lobby Settings filler`,
  //       userId: 'cllb7sjb50000m0a4oy4axdb5',
  //     },
  //     update: {},
  //   });
  // }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
