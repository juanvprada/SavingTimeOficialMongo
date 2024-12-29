import { create } from 'zustand';

const useStore = create((set) => ({
    token: localStorage.getItem('token') || null,
    role: localStorage.getItem('role') || null,
    username: localStorage.getItem('name') || null,
    userId: localStorage.getItem('userId') || null, // Agregar userId
    likes: {},
    
    setToken: (token) => {
        localStorage.setItem('token', token);
        set({ token });
    },
    setRole: (role) => {
        localStorage.setItem('role', role);
        set({ role });
    },
    setUsername: (username) => {
        localStorage.setItem('name', username);
        set({ username });
    },
    setUserId: (userId) => {    
        localStorage.setItem('userId', userId);
        set({ userId });
    },
    addLike: (postId) => set((state) => ({
        likes: { ...state.likes, [postId]: (state.likes[postId] || 0) + 1 },
    })),
    removeLike: (postId) => set((state) => {
        const newLikes = { ...state.likes };
        if (newLikes[postId]) newLikes[postId] -= 1;
        return { likes: newLikes };
    }),
}));

export default useStore;











