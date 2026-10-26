import React, { useState } from 'react';
import { X, User as UserIcon, Lock, Mail, ShieldCheck } from 'lucide-react';
import { User } from '../../types';
import { DbService } from '../../services/dbService';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: User | null;
  onUserChange: (user: User | null) => void;
  onToast: (msg: string) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  user,
  onUserChange,
  onToast
}) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password || (!isLogin && !name)) return;

    const newUser: User = {
      id: `usr-${Date.now()}`,
      name: name || email.split('@')[0],
      email,
      listeningArchetype: 'The Midnight Architect'
    };

    DbService.setUser(newUser);
    onUserChange(newUser);
    onToast(isLogin ? `Welcome back, ${newUser.name}!` : `Account created for ${newUser.name}!`);
    onClose();
  };

  const handleLogout = () => {
    DbService.setUser(null);
    onUserChange(null);
    onToast('Signed out of Valence.');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/85 backdrop-blur-2xl text-[#e4e2dd] select-none">
      
      <div className="relative max-w-md w-full bg-[#12141a] border border-white/15 rounded-3xl p-8 shadow-2xl flex flex-col gap-6">
        
        <button
          onClick={onClose}
          className="absolute top-6 right-6 p-2 rounded-full bg-white/5 hover:bg-white/10 text-white/60 hover:text-white transition-all"
        >
          <X className="w-5 h-5" />
        </button>

        {user ? (
          <div className="flex flex-col items-center text-center gap-4 py-4">
            <div className="w-16 h-16 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-2xl font-bold font-display text-white">
              {user.name[0].toUpperCase()}
            </div>

            <div>
              <h3 className="font-display font-bold text-xl text-white flex items-center justify-center gap-1.5">
                {user.name} <ShieldCheck className="w-4 h-4 text-emerald-400" />
              </h3>
              <p className="text-xs font-mono text-white/50">{user.email}</p>
              <p className="text-xs font-serif italic text-amber-300 mt-2">
                Archetype: {user.listeningArchetype || 'The Midnight Architect'}
              </p>
            </div>

            <button
              onClick={handleLogout}
              className="w-full py-3 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/40 font-mono text-xs uppercase transition-all mt-4"
            >
              SIGN OUT
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="text-center mb-2">
              <h3 className="font-display font-bold text-2xl text-white uppercase tracking-wide">
                {isLogin ? 'WELCOME BACK' : 'CREATE ACCOUNT'}
              </h3>
              <p className="text-xs font-mono text-white/50 mt-1">
                Synchronize playlists & personal music library across devices
              </p>
            </div>

            {!isLogin && (
              <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-white/5 border border-white/10">
                <UserIcon className="w-4 h-4 text-white/40" />
                <input
                  type="text"
                  placeholder="Full Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="bg-transparent text-xs font-mono text-white focus:outline-none w-full"
                  required={!isLogin}
                />
              </div>
            )}

            <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-white/5 border border-white/10">
              <Mail className="w-4 h-4 text-white/40" />
              <input
                type="email"
                placeholder="Email Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-transparent text-xs font-mono text-white focus:outline-none w-full"
                required
              />
            </div>

            <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-white/5 border border-white/10">
              <Lock className="w-4 h-4 text-white/40" />
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-transparent text-xs font-mono text-white focus:outline-none w-full"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full py-3.5 rounded-xl bg-white text-black font-mono font-bold text-xs uppercase hover:bg-neutral-200 transition-all shadow-xl mt-2"
            >
              {isLogin ? 'SIGN IN' : 'REGISTER'}
            </button>

            <button
              type="button"
              onClick={() => setIsLogin(!isLogin)}
              className="text-xs font-mono text-white/50 hover:text-white transition-colors text-center mt-2"
            >
              {isLogin ? "Don't have an account? Sign up" : 'Already have an account? Sign in'}
            </button>
          </form>
        )}

      </div>

    </div>
  );
};
