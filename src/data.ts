/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { FoundPerson } from './types';

export const INITIAL_FOUND_PERSONS: FoundPerson[] = [
  {
    id: "usr_1a8c8b42-7db2-4e09-92c9-a31dfb17540a",
    name: "Juan Carlos Pérez",
    ci: "18.345.921",
    hospitalName: "Hospital Dr. Domingo Luciani (El Llanito)",
    locationAddress: "Piso 2, Ala de Trauma Shock, Caracas",
    contactPhone: "+58 412-5551234",
    physicalDescription: "Hombre de aproximadamente 35 años, contextura media, estatura 1.75m. Cicatriz en la ceja izquierda, vestía franela azul con rayas blancas y pantalón deportivo gris. Se encuentra consciente pero desorientado.",
    imageUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    dateFound: "2026-06-25T14:30:00Z",
    status: "hospitalizado"
  },
  {
    id: "usr_f9c2d1b5-8290-482a-a5c3-a3d162985172",
    name: "Desconocido (Refugiado #12)",
    ci: "Desconocido",
    hospitalName: "Refugio Polideportivo de La Guaira",
    locationAddress: "Zona B, Colchoneta 45, Av. José María España, La Guaira",
    contactPhone: "+58 414-9876543",
    physicalDescription: "Joven masculino, aproximadamente 18-22 años, cabello corto negro ondulado, tez trigueña, lunar grande cerca de la oreja derecha. Vestía suéter gris oscuro de capucha y jeans negros. No recuerda su cédula ni lugar de procedencia.",
    imageUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    dateFound: "2026-06-26T08:15:00Z",
    status: "refugiado"
  },
  {
    id: "usr_42bc02e1-4567-4a0b-9dfb-c9e830f0dfc8",
    name: "María Alejandra Colmenares",
    ci: "24.991.023",
    hospitalName: "Hospital Periférico de Catia",
    locationAddress: "Sala de Recuperación A, Caracas",
    contactPhone: "+58 416-1234567",
    physicalDescription: "Mujer de aprox. 28 años, cabello castaño largo liso, estatura 1.62m. Tatuaje pequeño de mariposa en la muñeca derecha. Vestía blusa verde oliva y zapatos deportivos blancos. Sufrió contusiones leves pero está estable.",
    imageUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    dateFound: "2026-06-24T19:45:00Z",
    status: "hospitalizado"
  },
  {
    id: "usr_77a281fb-27cb-4b2a-a92c-ee91b92cd311",
    name: "Desconocida (Refugiada #34)",
    ci: "Desconocido",
    hospitalName: "Refugio Iglesia Corazón de Jesús",
    locationAddress: "Salón Parroquial, Petare, Caracas",
    contactPhone: "+58 424-3456789",
    physicalDescription: "Mujer adulta de aproximadamente 55-60 años, cabello canoso recogido, tez blanca, usa anteojos recetados con montura roja. Vestía bata de flores amarillas. Se encuentra en buen estado general pero con crisis de ansiedad.",
    imageUrl: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    dateFound: "2026-06-26T11:00:00Z",
    status: "refugiado"
  },
  {
    id: "usr_88cb01ff-12a3-49fb-81c8-c9201f9cc00d",
    name: "Santiago Alejandro Ruiz (Niño)",
    ci: "Desconocido",
    hospitalName: "Centro de Cuidado Infantil San José",
    locationAddress: "Área de Protección de Menores, Maracay, Aragua",
    contactPhone: "+58 412-7778899",
    physicalDescription: "Niño de aprox. 6-7 años, tez clara, ojos marrones, cabello castaño claro liso. Vestía franela roja de superhéroe y shorts de jean. Sabe que se llama Santiago pero desconoce su apellido y nombres de sus padres.",
    imageUrl: "https://images.unsplash.com/photo-1503919545889-aef636e10ad4?w=400&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    dateFound: "2026-06-25T10:00:00Z",
    status: "refugiado"
  }
];

export const DISASTER_STATS = {
  totalFound: 142,
  totalMissingSearched: 485,
  reunitedCount: 58,
  activeShelters: 12,
  lastUpdated: "Hace 5 minutos"
};
