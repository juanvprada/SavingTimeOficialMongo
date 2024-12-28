import React from 'react';
import { render, screen } from '@testing-library/react';
import Footer from '../components/Footer.jsx';
import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';

describe('Footer', () => {
    test('render the Footer', () => {
  render(
    <MemoryRouter>
      <Footer />
    </MemoryRouter>
  );
    console.log(screen.debug());

      /* para verificar si los titulos estan en el DOM */
      expect(screen.getByText('Enlaces útiles')).toBeInTheDocument();
      expect(screen.getByText('Síguenos')).toBeInTheDocument();
      expect(screen.getByText(/© 2024 Bio Blog/i)).toBeInTheDocument(); /* esto es para saber si cambia */
    });

    test('check if the links in the Footer work', async () => {
      render(
        <MemoryRouter>
          <Footer />
        </MemoryRouter>
      );
  
      const user = userEvent.setup(); /* inicia UserEvent */

      const githubLink = screen.getByText('GitHub').closest('a'); /* simulo el click en el enlace siguenos y encuentra el enlace mas cercano */
      expect(githubLink).toHaveAttribute('href', 'https://github.com/Omarlsant/bio-blog/tree/dev'); /* verifico si el enlace existe y si cambia a la ruta correcta */
      await user.click(githubLink);/* simulo el click en el enlace */
    });
});