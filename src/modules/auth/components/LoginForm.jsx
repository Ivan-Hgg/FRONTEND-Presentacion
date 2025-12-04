import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';

//Hooks
import useAuth from '../hook/useAuth';

//Components
import Input from '../../shared/components/Input';
import PasswordInput from '../../shared/components/PasswordInput';
import Button from '../../shared/components/Button';

//Helpers
import { frontendErrorMessage } from '../helpers/backendError';
import { handleApiError } from '../../shared/helpers/handleApiError';

function LoginForm({ onSuccess }) {
  const [errorMessage, setErrorMessage] = useState('');
  const [errorMessages, setErrorMessages] = useState([]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ defaultValues: { username: '', password: '' } });

  const navigate = useNavigate();
  const { singin } = useAuth();

  const onValid = async (formData) => {
    setErrorMessage('');
    setErrorMessages([]);

    try {
      const { user, error } = await singin(formData.username, formData.password);

      if (error) {
        const { full } = handleApiError(error, {
          frontendMessages: frontendErrorMessage,
          setErrorMessage,
          showAlert: false,
        });

        const detailedMessages = (full?.errors || []).map(
          (err) => frontendErrorMessage[err.code] || err.message,
        ).filter(Boolean);

        setErrorMessages(detailedMessages);

        return;
      }

      if (onSuccess) return onSuccess();

      const role = (user?.role || '').toLowerCase(); // Convertimos a minúscula por seguridad

      if (role === 'admin') {
        navigate('/admin/home'); // Al panel de Admin
      } else {
        navigate('/'); // A la tienda (Home del cliente)
      }

    } catch (err) {
      handleApiError(err, {
        frontendMessages: frontendErrorMessage,
        setErrorMessage,
        showAlert: true, // mostrar alert si falla de forma inesperada
      });
    }
  };

  return (
    <form
      className="flex flex-col gap-4 bg-white p-4 rounded-xl w-[98%] max-w-md mx-auto animate-slideUp shadow-lg sm:w-[99%]"
      onSubmit={handleSubmit(onValid)}
    >
      <Input
        label="Usuario"
        {...register('username', { required: 'Usuario es obligatorio' })}
        error={errors.username?.message}
      />

      <PasswordInput
        label="Contraseña"
        compact
        error={errors.password?.message}
        registerProps={register('password', { required: 'La contraseña es obligatoria' })}
      />

      <div className="flex flex-col gap-4">
        <Button type="submit">Iniciar Sesion</Button>

        {!onSuccess && (
          <Button
            type="button"
            onClick={() => navigate('/register')}
          >
            Registrarse
          </Button>
        )}
      </div>

      {errorMessages.length > 0 ? (
        <ul className="text-red-500 text-sm space-y-1">
          {errorMessages.map((msg, idx) => (
            <li key={idx}>{msg}</li>
          ))}
        </ul>
      ) : errorMessage && (
        <p className="text-red-500 text-sm text-center">{errorMessage}</p>
      )}
    </form>
  );
}

export default LoginForm;
