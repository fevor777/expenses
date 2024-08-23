export type Category = {
  id: string;
  name: string;
  icon: string;
  color: string;
};

export const getCategoryNameById = (id: string): string => {
  const category = Categories.find((category) => category.id === id);
  return category ? category.name : '';
};

export const Categories: Category[] = [
  {
    id: 'meal',
    name: 'Питание',
    icon: 'fa-solid fa-bell-concierge',
    color: '#474747',
  },
  {
    id: 'clothes',
    name: 'Одежда',
    icon: 'fas fa-tshirt',
    color: '#a99e00',
  },
  {
    id: 'entertainments',
    name: 'Развлечение',
    icon: 'fas fa-film',
    color: '#795548',
  },
  {
    id: 'sport',
    name: 'Спорт',
    icon: 'fas fa-dumbbell',
    color: '#607D8B',
  },
  {
    id: 'utility-bills',
    name: 'Коммуналка',
    icon: 'fas fa-water',
    color: '#2196F3',
  },
  {
    id: 'home',
    name: 'Для дома',
    icon: 'fas fa-home',
    color: '#9C27B0',
  },
  {
    id: 'rental-payment',
    name: 'Аренда жилья',
    icon: 'fas fa-building',
    color: '#673AB7',
  },
  {
    id: 'bus',
    name: 'Общ. транспорт',
    icon: 'fas fa-bus',
    color: '#3F51B5',
  },
  {
    id: 'pharmacy',
    name: 'Аптека',
    icon: 'fas fa-pills',
    color: '#2196F3',
  },
  {
    id: 'travel',
    name: 'Путешествие',
    icon: 'fas fa-plane',
    color: '#009688',
  },
  {
    id: 'barbershop',
    name: 'Парикмахерская',
    icon: 'fas fa-cut',
    color: '#FFC107',
  },
  {
    id: 'alcohol',
    name: 'Выпивка',
    icon: 'fas fa-wine-bottle',
    color: '#FF5722',
  },
  {
    id: 'nicotine',
    name: 'Сигареты',
    icon: 'fas fa-smoking',
    color: '#FF5722',
  },
  {
    id: 'subscriptions',
    name: 'Подписка',
    icon: 'fas fa-newspaper',
    color: '#FF5722',
  },
  {
    id: 'another',
    name: 'Разное',
    icon: 'fas fa-random',
    color: '#FF5722',
  },
];
