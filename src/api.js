export async function fetchAvailabilities({ year, semester, day, period }) {
  const response = await fetch(
    `https://script.google.com/macros/s/AKfycbzTg1lbdqqbC6YKhSM4BsBOOl-YJHMiF6_ObhNioLRzh-g1rtD-I2xT14PSaRnxQQ7z/exec?year=${year}&semester=${semester}&day=${day}&period=${period}`
  );
  const data = await response.json();
  return data.data;
}