import React, { useCallback, useRef, useState } from 'react';
import { FiLogIn, FiMail } from 'react-icons/fi';
import { Form } from '@unform/web';
import { FormHandles } from '@unform/core';
import * as Yup from 'yup';
import { Link } from 'react-router-dom';

import logoImg from '../../assets/logo.svg';

import getValidationErrors from '../../utils/getValidationErrors';

import { useToast } from '../../hooks/toast';
import api from '../../services/api';

import { Container, Content, AnimationContainer, Background } from './styles';
import Input from '../../components/Input';
import Button from '../../components/Button';

interface ForgotPasswordFormData {
  email: string;
}

const ForgotPassword: React.FC = () => {
  const [loading, setLoading] = useState(false);

  const formRef = useRef<FormHandles>(null);

  const { addToast } = useToast();

  const handleSubmit = useCallback(
    async (data: ForgotPasswordFormData) => {
      try {
        setLoading(true);

        // Start validation with no previous errors
        formRef.current?.setErrors({});

        // Create the model of the object we receive and set its props and requirements, with an error msg in case it doesn't match
        const schema = Yup.object().shape({
          email: Yup.string()
            .required('E-mail obrigatório')
            .email('Digite um e-mail válido'),
        });

        // Check if all requirements of the schema are followed
        await schema.validate(data, {
          abortEarly: false,
        });

        await api.post('/password/forgot', {
          email: data.email,
        });

        addToast({
          type: 'success',
          title: 'E-mail de recuperação enviado',
          description:
            'Enviamos um e-mail para confirmar a recuperação de senha, cheque sua caixa de entrada',
        });
      } catch (err) {
        // If the error was originated from the Yup validation, fields don't match the requirements, show the error tooltip
        if (err instanceof Yup.ValidationError) {
          const errors = getValidationErrors(err);

          formRef.current?.setErrors(errors);

          return;
        }

        // If something else originated the error, show a toast with a message about that error
        addToast({
          type: 'error',
          title: 'Erro na recuperação de senha',
          description:
            'Ocorreu um erro ao tentar fazer a recuperação de senha, tente novamente',
        });
      } finally {
        // Set loading to false whether the try worked or we fell on the catch
        setLoading(false);
      }
    },
    [addToast],
  );

  return (
    <Container>
      <Content>
        <AnimationContainer>
          <img src={logoImg} alt="GoBarber logo" />

          <Form ref={formRef} onSubmit={handleSubmit}>
            <h1>Recuperar senha</h1>

            <Input
              name="email"
              icon={FiMail}
              type="email"
              placeholder="E-mail"
            />

            <Button loading={loading} type="submit">
              Recuperar
            </Button>
          </Form>

          <Link to="/">
            <FiLogIn />
            Voltar ao logon
          </Link>
        </AnimationContainer>
      </Content>

      <Background />
    </Container>
  );
};

export default ForgotPassword;
