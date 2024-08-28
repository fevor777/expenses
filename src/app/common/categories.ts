export type Category = {
  id: string;
  name: string;
  icon: string;
  color: string;
  includeInBalance: boolean;
};

export const getCategoryNameById = (id: string): string => {
  const category = Categories.find((category) => category.id === id);
  return category ? category.name : '';
};

export const getCategoryById = (id: string): Category => {
  return Categories.find((category) => category.id === id);
};

export const Categories: Category[] = [
  {
    id: 'subscriptions',
    name: 'Подписка',
    icon: 'fas fa-newspaper',
    color: '#FFC107',
    includeInBalance: false,
  },
  {
    id: 'entertainments',
    name: 'Развлечение',
    icon: 'fas fa-film',
    color: '#795548',
    includeInBalance: true,
  },
  {
    id: 'nicotine',
    name: 'Сигареты',
    icon: 'fas fa-smoking',
    color: '#FF5722',
    includeInBalance: true,
  },
  {
    id: 'travel',
    name: 'Путешествие',
    icon: 'fas fa-plane',
    color: '#009688',
    includeInBalance: true,
  },
  {
    id: 'home',
    name: 'Для дома',
    icon: 'fas fa-home',
    color: '#9C27B0',
    includeInBalance: true,
  },
  {
    id: 'alcohol',
    name: 'Выпивка',
    icon: 'fas fa-wine-bottle',
    color: '#FF5722',
    includeInBalance: true,
  },
  {
    id: 'meal',
    name: 'Питание',
    icon: 'fa-solid fa-bell-concierge',
    color: '#474747',
    includeInBalance: true,
  },
  {
    id: 'bus',
    name: 'Общ. транспорт',
    icon: 'fas fa-bus',
    color: '#3F51B5',
    includeInBalance: true,
  },
  {
    id: 'utility-bills',
    name: 'Коммуналка',
    icon: 'fas fa-water',
    color: '#2196F3',
    includeInBalance: false,
  },
  {
    id: 'pharmacy',
    name: 'Медицина',
    icon: 'fas fa-prescription-bottle-alt',
    color: '#2196F3',
    includeInBalance: true,
  },
  {
    id: 'barbershop',
    name: 'Парикмахерская',
    icon: 'fas fa-cut',
    color: '#FFC107',
    includeInBalance: true,
  },
  {
    id: 'electronics',
    name: 'Электроника',
    icon: 'fas fa-tablet-alt',
    color: '#9E9E9E',
    includeInBalance: false,
  },
  {
    id: 'clothes',
    name: 'Одежда',
    icon: 'fas fa-tshirt',
    color: '#a99e00',
    includeInBalance: true,
  },
  {
    id: 'another',
    name: 'Разное',
    icon: 'fas fa-random',
    color: '#FF5722',
    includeInBalance: true,
  },
  {
    id: 'sport',
    name: 'Спорт',
    icon: 'fas fa-dumbbell',
    color: '#607D8B',
    includeInBalance: false,
  },
  {
    id: 'rental-payment',
    name: 'Аренда жилья',
    icon: 'fas fa-building',
    color: '#673AB7',
    includeInBalance: false,
  },
];
