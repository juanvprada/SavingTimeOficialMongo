import { create } from 'zustand';

const useStore = create((set) => ({
  // Estado inicial con valores del localStorage
  token: localStorage.getItem('token') || null,
  role: localStorage.getItem('role') || null,
  username: localStorage.getItem('name') || null,
  userId: localStorage.getItem('userId') || null,
  likes: {},

  // Acciones mejoradas con mejor manejo de tipos y validación
  setToken: (token) => {
    if (token) {
      localStorage.setItem('token', token);
    } else {
      localStorage.removeItem('token');
    }
    set({ token });
  },

  setRole: (role) => {
    if (role) {
      localStorage.setItem('role', role);
    } else {
      localStorage.removeItem('role');
    }
    set({ role });
  },

  setUsername: (username) => {
    if (username) {
      localStorage.setItem('name', username);
    } else {
      localStorage.removeItem('name');
    }
    set({ username });
  },

  setUserId: (userId) => {
    if (userId) {
      // Manejo seguro de diferentes tipos de userId
      const id = typeof userId === 'object' ? userId.toString() : String(userId);
      localStorage.setItem('userId', id);
      set({ userId: id });
    } else {
      localStorage.removeItem('userId');
      set({ userId: null });
    }
  },

  // Método para limpiar todo el estado
  clearStore: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('name');
    localStorage.removeItem('userId');
    set({
      token: null,
      role: null,
      username: null,
      userId: null,
      likes: {}
    });
  },

  // Manejo de likes mejorado
  addLike: (postId) => 
    set((state) => ({
      likes: { 
        ...state.likes, 
        [postId]: (state.likes[postId] || 0) + 1 
      }
    })),

  removeLike: (postId) => 
    set((state) => {
      const newLikes = { ...state.likes };
      if (newLikes[postId] && newLikes[postId] > 0) {
        newLikes[postId] -= 1;
      }
      return { likes: newLikes };
    }),

  // Nuevo método para establecer todos los datos del usuario de una vez
  setUserData: (userData) => {
    if (!userData) return;

    const { token, role, name, _id } = userData;
    
    if (token) localStorage.setItem('token', token);
    if (role) localStorage.setItem('role', role);
    if (name) localStorage.setItem('name', name);
    if (_id) localStorage.setItem('userId', _id.toString());

    set({
      token: token || null,
      role: role || null,
      username: name || null,
      userId: _id ? _id.toString() : null
    });
  }
}));

export default useStore;











