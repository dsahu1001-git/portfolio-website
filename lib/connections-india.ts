export interface ConnectionGroup {
  name: string;
  description: string;
  color: string;
  words: string[];
}

export const connectionsIndiaGroups: ConnectionGroup[] = [
  {
    name: 'IPL Teams',
    description: 'Franchise names from Indian Premier League cricket.',
    color: 'bg-amber-500 text-black',
    words: ['MI', 'CSK', 'RCB', 'KKR'],
  },
  {
    name: 'Street Food',
    description: 'Popular bites you will find across Indian streets.',
    color: 'bg-sky-500 text-white',
    words: ['VADA PAV', 'POHA', 'CHAAT', 'IDLI'],
  },
  {
    name: 'UPI Apps',
    description: 'Common payment apps used in India.',
    color: 'bg-emerald-500 text-black',
    words: ['GPAY', 'PHONEPE', 'PAYTM', 'BHIM'],
  },
  {
    name: 'Hill Stations',
    description: 'Classic Indian mountain getaways.',
    color: 'bg-fuchsia-500 text-white',
    words: ['SHIMLA', 'OOTY', 'MANALI', 'MUNNAR'],
  },
];
