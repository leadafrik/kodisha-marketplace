import { County, Ward } from '@/types';

export const kenyaCounties: County[] = [
  {
    code: 1,
    name: 'MOMBASA',
    constituencies: [
      {
        name: 'CHANGAMWE',
        wards: [
          { code: 1, name: 'PORT REITZ' },
          { code: 2, name: 'KIPEVU' },
          { code: 3, name: 'AIRPORT' },
          { code: 4, name: 'CHANGAMWE' },
          { code: 5, name: 'CHAANI' }
        ]
      },
      {
        name: 'JOMVU',
        wards: [
          { code: 6, name: 'JOMVU KUU' },
          { code: 7, name: 'MIRITINI' },
          { code: 8, name: 'MIKINDANI' }
        ]
      },
      {
        name: 'KISAUNI',
        wards: [
          { code: 9, name: 'MJAMBERE' },
          { code: 10, name: 'JUNDA' },
          { code: 11, name: 'BAMBURI' },
          { code: 12, name: 'MWAKIRUNGE' },
          { code: 13, name: 'MTOPANGA' },
          { code: 14, name: 'MAGOGONI' },
          { code: 15, name: 'SHANZU' }
        ]
      },
      {
        name: 'NYALI',
        wards: [
          { code: 16, name: 'FRERE TOWN' },
          { code: 17, name: 'ZIWA LA NG\'OMBE' },
          { code: 18, name: 'MKOMANI' },
          { code: 19, name: 'KONGOWEA' },
          { code: 20, name: 'KADZANDANI' }
        ]
      },
      {
        name: 'LIKONI',
        wards: [
          { code: 21, name: 'MTONGWE' },
          { code: 22, name: 'SHIKA ADABU' },
          { code: 23, name: 'BOFU' },
          { code: 24, name: 'LIKONI' },
          { code: 25, name: 'TIMBWANI' }
        ]
      },
      {
        name: 'MVITA',
        wards: [
          { code: 26, name: 'MJI WA KALE/MAKADARA' },
          { code: 27, name: 'TUDOR' },
          { code: 28, name: 'TONONOKA' },
          { code: 29, name: 'SHIMANZI/GANJONI' },
          { code: 30, name: 'MAJENGO' }
        ]
      }
    ]
  },
  {
    code: 2,
    name: 'KWALE',
    constituencies: [
      {
        name: 'MSAMBWENI',
        wards: [
          { code: 31, name: 'GOMBATO BONGWE' },
          { code: 32, name: 'UKUNDA' },
          { code: 33, name: 'KINONDO' },
          { code: 34, name: 'RAMISI' }
        ]
      },
      {
        name: 'LUNGALUNGA',
        wards: [
          { code: 35, name: 'PONGWE/KIKONENI' },
          { code: 36, name: 'DZOMBO' },
          { code: 37, name: 'MWERENI' },
          { code: 38, name: 'VANGA' }
        ]
      },
      {
        name: 'MATUGA',
        wards: [
          { code: 39, name: 'TSIMBA GOLINI' },
          { code: 40, name: 'WAA' },
          { code: 41, name: 'TIWI' },
          { code: 42, name: 'KUBO SOUTH' },
          { code: 43, name: 'MKONGANI' }
        ]
      },
      {
        name: 'KINANGO',
        wards: [
          { code: 44, name: 'NDAVAYA' },
          { code: 45, name: 'PUMA' },
          { code: 46, name: 'KINANGO' },
          { code: 47, name: 'MACKINNON ROAD' },
          { code: 48, name: 'CHENGONI/SAMBURU' },
          { code: 49, name: 'MWAVUMBO' },
          { code: 50, name: 'KASEMENI' }
        ]
      }
    ]
  },
  {
    code: 3,
    name: 'KILIFI',
    constituencies: [
      {
        name: 'KILIFI NORTH',
        wards: [
          { code: 51, name: 'TEZO' },
          { code: 52, name: 'SOKONI' },
          { code: 53, name: 'KIBARANI' },
          { code: 54, name: 'DABASO' },
          { code: 55, name: 'MATSANGONI' },
          { code: 56, name: 'WATAMU' },
          { code: 57, name: 'MNARANI' }
        ]
      },
      {
        name: 'KILIFI SOUTH',
        wards: [
          { code: 58, name: 'JUNJU' },
          { code: 59, name: 'MWARAKAYA' },
          { code: 60, name: 'SHIMO LA TEWA' },
          { code: 61, name: 'CHASIMBA' },
          { code: 62, name: 'MTEPENI' }
        ]
      },
      {
        name: 'KALOLENI',
        wards: [
          { code: 63, name: 'MARIAKANI' },
          { code: 64, name: 'KAYAFUNGO' },
          { code: 65, name: 'KALOLENI' },
          { code: 66, name: 'MWANAMWINGA' }
        ]
      },
      {
        name: 'RABAI',
        wards: [
          { code: 67, name: 'MWAWESA' },
          { code: 68, name: 'RURUMA' },
          { code: 69, name: 'KAMBE/RIBE' },
          { code: 70, name: 'RABAI/KISURUTINI' }
        ]
      },
      {
        name: 'GANZE',
        wards: [
          { code: 71, name: 'GANZE' },
          { code: 72, name: 'BAMBA' },
          { code: 73, name: 'JARIBUNI' },
          { code: 74, name: 'SOKOKE' }
        ]
      },
      {
        name: 'MALINDI',
        wards: [
          { code: 75, name: 'JILORE' },
          { code: 76, name: 'KAKUYUNI' },
          { code: 77, name: 'GANDA' },
          { code: 78, name: 'MALINDI TOWN' },
          { code: 79, name: 'SHELLA' }
        ]
      },
      {
        name: 'MAGARINI',
        wards: [
          { code: 80, name: 'MARAFA' },
          { code: 81, name: 'MAGARINI' },
          { code: 82, name: 'GONGONI' },
          { code: 83, name: 'ADU' },
          { code: 84, name: 'GARASHI' },
          { code: 85, name: 'SABAKI' }
        ]
      }
    ]
  },
  {
    code: 4,
    name: 'TANA RIVER',
    constituencies: [
      {
        name: 'GARSEN',
        wards: [
          { code: 86, name: 'KIPINI EAST' },
          { code: 87, name: 'GARSEN SOUTH' },
          { code: 88, name: 'KIPINI WEST' },
          { code: 89, name: 'GARSEN CENTRAL' },
          { code: 90, name: 'GARSEN WEST' },
          { code: 91, name: 'GARSEN NORTH' }
        ]
      },
      {
        name: 'GALOLE',
        wards: [
          { code: 92, name: 'KINAKOMBA' },
          { code: 93, name: 'MIKINDUNI' },
          { code: 94, name: 'CHEWANI' },
          { code: 95, name: 'WAYU' }
        ]
      },
      {
        name: 'BURA',
        wards: [
          { code: 96, name: 'CHEWELE' },
          { code: 97, name: 'HIRIMANI' },
          { code: 98, name: 'BANGALE' },
          { code: 99, name: 'SALA' },
          { code: 100, name: 'MADOGO' }
        ]
      }
    ]
  },
  {
    code: 5,
    name: 'LAMU',
    constituencies: [
      {
        name: 'LAMU EAST',
        wards: [
          { code: 101, name: 'FAZA' },
          { code: 102, name: 'KIUNGA' },
          { code: 103, name: 'BASUBA' }
        ]
      },
      {
        name: 'LAMU WEST',
        wards: [
          { code: 104, name: 'SHELLA' },
          { code: 105, name: 'MKOMANI' },
          { code: 106, name: 'HINDI' },
          { code: 107, name: 'MKUNUMBI' },
          { code: 108, name: 'HONGWE' },
          { code: 109, name: 'WITU' },
          { code: 110, name: 'BAHARI' }
        ]
      }
    ]
  },
  {
    code: 6,
    name: 'TAITA TAVETA',
    constituencies: [
      {
        name: 'TAVETA',
        wards: [
          { code: 111, name: 'CHALA' },
          { code: 112, name: 'MAHOO' },
          { code: 113, name: 'BOMANI' },
          { code: 114, name: 'MBOGHONI' },
          { code: 115, name: 'MATA' }
        ]
      },
      {
        name: 'WUNDANYI',
        wards: [
          { code: 116, name: 'WUNDANYI/MBALE' },
          { code: 117, name: 'WERUGHA' },
          { code: 118, name: 'WUMINGU/KISHUSHE' },
          { code: 119, name: 'MWANDA/MGANGE' }
        ]
      },
      {
        name: 'MWATATE',
        wards: [
          { code: 120, name: 'RONG\'E' },
          { code: 121, name: 'MWATATE' },
          { code: 122, name: 'BURA' },
          { code: 123, name: 'CHAWIA' },
          { code: 124, name: 'WUSI/KISHAMBA' }
        ]
      },
      {
        name: 'VOI',
        wards: [
          { code: 125, name: 'MBOLOLO' },
          { code: 126, name: 'SAGALLA' },
          { code: 127, name: 'KALOLENI' },
          { code: 128, name: 'MARUNGU' },
          { code: 129, name: 'KASIGAU' },
          { code: 130, name: 'NGOLIA' }
        ]
      }
    ]
  },
  {
    code: 7,
    name: 'GARISSA',
    constituencies: [
      {
        name: 'GARISSA TOWNSHIP',
        wards: [
          { code: 131, name: 'WABERI' },
          { code: 132, name: 'GALBET' },
          { code: 133, name: 'TOWNSHIP' },
          { code: 134, name: 'IFTIN' }
        ]
      },
      {
        name: 'BALAMBALA',
        wards: [
          { code: 135, name: 'BALAMBALA' },
          { code: 136, name: 'DANYERE' },
          { code: 137, name: 'JARA JARA' },
          { code: 138, name: 'SAKA' },
          { code: 139, name: 'SANKURI' }
        ]
      },
      {
        name: 'LAGDERA',
        wards: [
          { code: 140, name: 'MODOGASHE' },
          { code: 141, name: 'BENANE' },
          { code: 142, name: 'GOREALE' },
          { code: 143, name: 'MAALIMIN' },
          { code: 144, name: 'SABENA' },
          { code: 145, name: 'BARAKI' }
        ]
      },
      {
        name: 'DADAAB',
        wards: [
          { code: 146, name: 'DERTU' },
          { code: 147, name: 'DADAAB' },
          { code: 148, name: 'LABASIGALE' },
          { code: 149, name: 'DAMAJALE' },
          { code: 150, name: 'LIBOI' },
          { code: 151, name: 'ABAKAILE' }
        ]
      },
      {
        name: 'FAFI',
        wards: [
          { code: 152, name: 'BURA' },
          { code: 153, name: 'DEKAHARIA' },
          { code: 154, name: 'JARAJILA' },
          { code: 155, name: 'FAFI' },
          { code: 156, name: 'NANIGHI' }
        ]
      },
      {
        name: 'IJARA',
        wards: [
          { code: 157, name: 'HULUGHO' },
          { code: 158, name: 'SANGAILU' },
          { code: 159, name: 'IJARA' },
          { code: 160, name: 'MASALANI' }
        ]
      }
    ]
  },
  {
    code: 8,
    name: 'WAJIR',
    constituencies: [
      {
        name: 'WAJIR NORTH',
        wards: [
          { code: 161, name: 'GURAR' },
          { code: 162, name: 'BUTE' },
          { code: 163, name: 'KORONDILE' },
          { code: 164, name: 'MALKAGUFU' },
          { code: 165, name: 'BATALU' },
          { code: 166, name: 'DANABA' },
          { code: 167, name: 'GODOMA' }
        ]
      },
      {
        name: 'WAJIR EAST',
        wards: [
          { code: 168, name: 'WAGBERI' },
          { code: 169, name: 'TOWNSHIP' },
          { code: 170, name: 'BARWAGO' },
          { code: 171, name: 'KHOROF/HARAR' }
        ]
      },
      {
        name: 'TARBAJ',
        wards: [
          { code: 172, name: 'ELBEN' },
          { code: 173, name: 'SARMAN' },
          { code: 174, name: 'TARBAJ' },
          { code: 175, name: 'WARGADUD' }
        ]
      },
      {
        name: 'WAJIR WEST',
        wards: [
          { code: 176, name: 'ARBAJAHAN' },
          { code: 177, name: 'HADADO/ATHIBOHOL' },
          { code: 178, name: 'ADAMASAJIDE' },
          { code: 179, name: 'GANYURE/WAGALLA' }
        ]
      },
      {
        name: 'ELDAS',
        wards: [
          { code: 180, name: 'ELDAS' },
          { code: 181, name: 'DELLA' },
          { code: 182, name: 'LAKOLEY SOUTH/BASIR' },
          { code: 183, name: 'ELNUR/TULA TULA' }
        ]
      },
      {
        name: 'WAJIR SOUTH',
        wards: [
          { code: 184, name: 'BENANE' },
          { code: 185, name: 'BURDER' },
          { code: 186, name: 'DADAJA BULLA' },
          { code: 187, name: 'HABASSWEIN' },
          { code: 188, name: 'LAGBOGHOL SOUTH' },
          { code: 189, name: 'IBRAHIM URE' },
          { code: 190, name: 'DIIF' }
        ]
      }
    ]
  },
  {
    code: 9,
    name: 'MANDERA',
    constituencies: [
      {
        name: 'MANDERA WEST',
        wards: [
          { code: 191, name: 'TAKABA SOUTH' },
          { code: 192, name: 'TAKABA' },
          { code: 193, name: 'LAGSURE' },
          { code: 194, name: 'DANDU' },
          { code: 195, name: 'GITHER' }
        ]
      },
      {
        name: 'BANISSA',
        wards: [
          { code: 196, name: 'BANISSA' },
          { code: 197, name: 'DERKHALE' },
          { code: 198, name: 'GUBA' },
          { code: 199, name: 'MALKAMARI' },
          { code: 200, name: 'KILIWEHIRI' }
        ]
      },
      {
        name: 'MANDERA NORTH',
        wards: [
          { code: 201, name: 'ASHABITO' },
          { code: 202, name: 'GUTICHA' },
          { code: 203, name: 'MOROTHILE' },
          { code: 204, name: 'RHAMU' },
          { code: 205, name: 'RHAMU-DIMTU' }
        ]
      },
      {
        name: 'MANDERA SOUTH',
        wards: [
          { code: 206, name: 'WARGADUD' },
          { code: 207, name: 'KUTULO' },
          { code: 208, name: 'ELWAK SOUTH' },
          { code: 209, name: 'ELWAK NORTH' },
          { code: 210, name: 'SHIMBIR FATUMA' }
        ]
      },
      {
        name: 'MANDERA EAST',
        wards: [
          { code: 211, name: 'ARABIA' },
          { code: 212, name: 'TOWNSHIP' },
          { code: 213, name: 'NEBOI' },
          { code: 214, name: 'KHALALIO' },
          { code: 215, name: 'LIBEHIA' }
        ]
      },
      {
        name: 'LAFEY',
        wards: [
          { code: 216, name: 'SALA' },
          { code: 217, name: 'FINO' },
          { code: 218, name: 'LAFEY' },
          { code: 219, name: 'WARANQARA' },
          { code: 220, name: 'ALANGO GOF' }
        ]
      }
    ]
  },
  {
    code: 10,
    name: 'MARSABIT',
    constituencies: [
      {
        name: 'MOYALE',
        wards: [
          { code: 221, name: 'BUTIYE' },
          { code: 222, name: 'SOLOLO' },
          { code: 223, name: 'HEILLU/MANYATTA' },
          { code: 224, name: 'GOLBO' },
          { code: 225, name: 'MOYALE TOWNSHIP' },
          { code: 226, name: 'URAN' },
          { code: 227, name: 'OBBU' }
        ]
      },
      {
        name: 'NORTH HORR',
        wards: [
          { code: 228, name: 'DUKANA' },
          { code: 229, name: 'MAIKONA' },
          { code: 230, name: 'TURBI' },
          { code: 231, name: 'NORTH HORR' },
          { code: 232, name: 'ILLERET' }
        ]
      },
      {
        name: 'SAKU',
        wards: [
          { code: 233, name: 'SAGANTE/JALDESA' },
          { code: 234, name: 'KARARE' },
          { code: 235, name: 'MARSABIT CENTRAL' }
        ]
      },
      {
        name: 'LAISAMIS',
        wards: [
          { code: 236, name: 'LOIYANGALANI' },
          { code: 237, name: 'KARGI/SOUTH HORR' },
          { code: 238, name: 'KORR/NGURUNIT' },
          { code: 239, name: 'LOGO LOGO' },
          { code: 240, name: 'LAISAMIS' }
        ]
      }
    ]
  },
  {
    code: 11,
    name: 'ISIOLO',
    constituencies: [
      {
        name: 'ISIOLO NORTH',
        wards: [
          { code: 241, name: 'WABERA' },
          { code: 242, name: 'BULLA PESA' },
          { code: 243, name: 'CHARI' },
          { code: 244, name: 'CHERAB' },
          { code: 245, name: 'NGARE MARA' },
          { code: 246, name: 'BURAT' },
          { code: 247, name: 'OLDO/NYIRO' }
        ]
      },
      {
        name: 'ISIOLO SOUTH',
        wards: [
          { code: 248, name: 'GARBATULLA' },
          { code: 249, name: 'KINNA' },
          { code: 250, name: 'SERICHO' }
        ]
      }
    ]
  },
  {
    code: 12,
    name: 'MERU',
    constituencies: [
      {
        name: 'IGEMBE SOUTH',
        wards: [
          { code: 251, name: 'MAUA' },
          { code: 252, name: 'KIEGOI/ANTUBOCHIU' },
          { code: 253, name: 'ATHIRU GAITI' },
          { code: 254, name: 'AKACHIU' },
          { code: 255, name: 'KANUNI' }
        ]
      },
      {
        name: 'IGEMBE CENTRAL',
        wards: [
          { code: 256, name: 'AKIRANG\'ONDU' },
          { code: 257, name: 'ATHIRU RUUJINE' },
          { code: 258, name: 'IGEMBE EAST' },
          { code: 259, name: 'NJIA' },
          { code: 260, name: 'KANGETA' }
        ]
      },
      {
        name: 'IGEMBE NORTH',
        wards: [
          { code: 261, name: 'ANTUAMBUI' },
          { code: 262, name: 'NTUNENE' },
          { code: 263, name: 'ANTUBETWE KIONGO' },
          { code: 264, name: 'NAATHU' },
          { code: 265, name: 'AMWATHI' }
        ]
      },
      {
        name: 'TIGANIA WEST',
        wards: [
          { code: 266, name: 'ATHWANA' },
          { code: 267, name: 'AKITHII' },
          { code: 268, name: 'KIANJAI' },
          { code: 269, name: 'NKOMO' },
          { code: 270, name: 'MBEU' }
        ]
      },
      {
        name: 'TIGANIA EAST',
        wards: [
          { code: 271, name: 'THANGATHA' },
          { code: 272, name: 'MIKINDURI' },
          { code: 273, name: 'KIGUCHWA' },
          { code: 274, name: 'MUTHARA' },
          { code: 275, name: 'KARAMA' }
        ]
      },
      {
        name: 'NORTH IMENTI',
        wards: [
          { code: 276, name: 'MUNICIPALITY' },
          { code: 277, name: 'NTIMA EAST' },
          { code: 278, name: 'NTIMA WEST' },
          { code: 279, name: 'NYAKI WEST' },
          { code: 280, name: 'NYAKI EAST' }
        ]
      },
      {
        name: 'BUURI',
        wards: [
          { code: 281, name: 'TIMAU' },
          { code: 282, name: 'KISIMA' },
          { code: 283, name: 'KIIRUA/NAARI' },
          { code: 284, name: 'RUIRI/RWARERA' },
          { code: 289, name: 'KIBIRICHIA' }
        ]
      },
      {
        name: 'CENTRAL IMENTI',
        wards: [
          { code: 285, name: 'MWANGANTHIA' },
          { code: 286, name: 'ABOTHUGUCHI CENTRAL' },
          { code: 287, name: 'ABOTHUGUCHI WEST' },
          { code: 288, name: 'KIAGU' }
        ]
      },
      {
        name: 'SOUTH IMENTI',
        wards: [
          { code: 290, name: 'MITUNGUU' },
          { code: 291, name: 'IGOJI EAST' },
          { code: 292, name: 'IGOJI WEST' },
          { code: 293, name: 'ABOGETA EAST' },
          { code: 294, name: 'ABOGETA WEST' },
          { code: 295, name: 'NKUENE' }
        ]
      }
    ]
  },
  {
    code: 13,
    name: 'THARAKA - NITHI',
    constituencies: [
      {
        name: 'MAARA',
        wards: [
          { code: 296, name: 'MITHERU' },
          { code: 297, name: 'MUTHAMBI' },
          { code: 298, name: 'MWIMBI' },
          { code: 299, name: 'GANGA' },
          { code: 300, name: 'CHOGORIA' }
        ]
      },
      {
        name: 'CHUKA/IGAMBANG\'OMBE',
        wards: [
          { code: 301, name: 'MARIANI' },
          { code: 302, name: 'KARINGANI' },
          { code: 303, name: 'MAGUMONI' },
          { code: 304, name: 'MUGWE' },
          { code: 305, name: 'IGAMBANG\'OMBE' }
        ]
      },
      {
        name: 'THARAKA',
        wards: [
          { code: 306, name: 'GATUNGA' },
          { code: 307, name: 'MUKOTHIMA' },
          { code: 308, name: 'NKONDI' },
          { code: 309, name: 'CHIAKARIGA' },
          { code: 310, name: 'MARIMANTI' }
        ]
      }
    ]
  },
  {
    code: 14,
    name: 'EMBU',
    constituencies: [
      {
        name: 'MANYATTA',
        wards: [
          { code: 311, name: 'RUGURU/NGANDORI' },
          { code: 312, name: 'KITHIMU' },
          { code: 313, name: 'NGINDA' },
          { code: 314, name: 'MBETI NORTH' },
          { code: 315, name: 'KIRIMARI' },
          { code: 316, name: 'GATURI SOUTH' }
        ]
      },
      {
        name: 'RUNYENJES',
        wards: [
          { code: 317, name: 'GATURI NORTH' },
          { code: 318, name: 'KAGAARI SOUTH' },
          { code: 319, name: 'CENTRAL WARD' },
          { code: 320, name: 'KAGAARI NORTH' },
          { code: 321, name: 'KYENI NORTH' },
          { code: 322, name: 'KYENI SOUTH' }
        ]
      },
      {
        name: 'MBEERE SOUTH',
        wards: [
          { code: 323, name: 'MWEA' },
          { code: 324, name: 'MAKIMA' },
          { code: 325, name: 'MBETI SOUTH' },
          { code: 326, name: 'MAVURIA' },
          { code: 327, name: 'KIAMBERE' }
        ]
      },
      {
        name: 'MBEERE NORTH',
        wards: [
          { code: 328, name: 'NTHAWA' },
          { code: 329, name: 'MUMINJI' },
          { code: 330, name: 'EVURORE' }
        ]
      }
    ]
  },
  {
    code: 15,
    name: 'KITUI',
    constituencies: [
      {
        name: 'MWINGI NORTH',
        wards: [
          { code: 331, name: 'NGOMENI' },
          { code: 332, name: 'KYUSO' },
          { code: 333, name: 'MUMONI' },
          { code: 334, name: 'TSEIKURU' },
          { code: 335, name: 'THARAKA' }
        ]
      },
      {
        name: 'MWINGI WEST',
        wards: [
          { code: 336, name: 'KYOME/THAANA' },
          { code: 337, name: 'NGUUTANI' },
          { code: 338, name: 'MIGWANI' },
          { code: 339, name: 'KIOMO/KYETHANI' }
        ]
      },
      {
        name: 'MWINGI CENTRAL',
        wards: [
          { code: 340, name: 'CENTRAL' },
          { code: 341, name: 'KIVOU' },
          { code: 342, name: 'NGUNI' },
          { code: 343, name: 'NUU' },
          { code: 344, name: 'MUI' },
          { code: 345, name: 'WAITA' }
        ]
      },
      {
        name: 'KITUI WEST',
        wards: [
          { code: 346, name: 'MUTONGUNI' },
          { code: 347, name: 'KAUWI' },
          { code: 348, name: 'MATINYANI' },
          { code: 349, name: 'KWA MUTONGA/KITHUMULA' }
        ]
      },
      {
        name: 'KITUI RURAL',
        wards: [
          { code: 350, name: 'KISASI' },
          { code: 351, name: 'MBITINI' },
          { code: 352, name: 'KWAVONZA/YATTA' },
          { code: 353, name: 'KANYANGI' }
        ]
      },
      {
        name: 'KITUI CENTRAL',
        wards: [
          { code: 354, name: 'MIAMBANI' },
          { code: 355, name: 'TOWNSHIP' },
          { code: 356, name: 'KYANGWITHYA WEST' }
        ]
      }
    ]
  }
];

// Helper function to get county by code
export function getCountyByCode(code: number): County | undefined {
  return kenyaCounties.find(county => county.code === code);
}

// Helper function to get county by name
export function getCountyByName(name: string): County | undefined {
  return kenyaCounties.find(county => county.name.toUpperCase() === name.toUpperCase());
}

// Helper function to get all county names
export function getAllCountyNames(): string[] {
  return kenyaCounties.map(county => county.name);
}

// Helper function to get wards for a county
export function getCountyWards(countyCode: number): Ward[] {
  const county = getCountyByCode(countyCode);
  if (!county) return [];
  return county.constituencies.flatMap(c => c.wards);
}
