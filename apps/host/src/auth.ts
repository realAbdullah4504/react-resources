export type User = {
  id: string;
  name: string;
  token: string;
};

let currentUser: User | null = null;

export function login(user: User) {
  currentUser = user;
  localStorage.setItem("user", JSON.stringify(user));
}

export function logout() {
  currentUser = null;
  localStorage.removeItem("user");
}

export function getUser(): User | null {
  if (currentUser) return currentUser;

  const stored = localStorage.getItem("user");
  if (stored) {
    currentUser = JSON.parse(stored);
    return currentUser;
  }

  return null;
}