import React, { useState } from 'react';
import LoginForm from './LoginForm';
import RegisterForm from './RegisterForm';
import TermsAndConditions from './Terms';
import PrivacyPolicy from './Privacy';
import Modal from './Modal';

const AuthForm = ({ textColor = 'text-gray-500', inputTextColor = 'text-gray-500', formBackground }) => {
    const [isLogin, setIsLogin] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [modalContent, setModalContent] = useState(null);

    const openModal = (content) => {
        setModalContent(content);
        setShowModal(true);
    };

    return (
        <section className="max-w-full sm:max-w-md mx-auto p-4 bg-transparent rounded-lg mt-8 overflow-y-auto"> {/* Changed mt-0 to mt-8 */}
            <div className="text-center mb-6"> {/* Increased from mb-4 */}
                <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-semibold text-[#F5F2ED] mb-3"> {/* Increased from mb-2 */}
                    {isLogin ? 'Iniciar Sesión' : 'Registro de Usuario'}
                </h2>
                <p className={`text-sm sm:text-base md:text-lg lg:text-xl ${textColor} mb-4`}> {/* Increased from mb-2 */}
                    {isLogin ? 'Accede a tu cuenta para continuar.' : 'Crea una cuenta para acceder a contenido exclusivo.'}
                </p>
            </div>

            {/* Botones para alternar entre Login y Registro */}
            <div className="flex justify-center mb-2"> {/* Reduced mb-4 to mb-2 */}
                <button
                    onClick={() => setIsLogin(true)}
                    className={`w-44 py-2 text-center rounded mx-2 transition-colors ${
                        isLogin 
                            ? 'bg-[#1B3A4B] text-white' 
                            : 'bg-[#E3D5C7] text-[#1B3A4B]'
                    }`}
                >
                    Iniciar Sesión
                </button>
                <button
                    onClick={() => setIsLogin(false)}
                    className={`w-44 py-2 text-center rounded mx-2 transition-colors ${
                        !isLogin 
                            ? 'bg-[#1B3A4B] text-white' 
                            : 'bg-[#E3D5C7] text-[#1B3A4B]'
                    }`}
                >
                    Registrarse
                </button>
            </div>

            {/* Forms with reduced padding */}
            <div className="space-y-2"> {/* Reduced space-y-4 to space-y-2 */}
                {isLogin ? (
                    <LoginForm inputTextColor={inputTextColor} formBackground={formBackground} />
                ) : (
                    <RegisterForm inputTextColor={inputTextColor} formBackground={formBackground} />
                )}
            </div>

            <footer className="mt-2 text-center text-sm text-[#E3D5C7]"> {/* Reduced mt-4 to mt-2 */}
                <p>
                    Al registrarte, aceptas nuestros{' '}
                    <button
                        onClick={() => openModal(<TermsAndConditions />)}
                        className="text-[#C68B59] underline hover:text-[#8A8B6C] focus:outline-none transition"
                    >
                        Términos y Condiciones
                    </button>{' '}
                    y la{' '}
                    <button
                        onClick={() => openModal(<PrivacyPolicy />)}
                        className="text-[#C68B59] underline hover:text-[#8A8B6C] focus:outline-none transition"
                    >
                        Política de Privacidad
                    </button>.
                </p>
            </footer>

            {showModal && (
                <Modal onClose={() => setShowModal(false)}>
                    {modalContent}
                </Modal>
            )}
        </section>
    );
};

export default AuthForm;
