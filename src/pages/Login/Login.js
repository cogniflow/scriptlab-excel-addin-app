import { h } from 'preact';
import htm from 'htm';

import { CogniflowLogo } from './../../assets';
import { useAuthContext } from '../../context/AuthContext';
import { useState, useContext } from 'preact/hooks';
// import { useContext } from 'preact';

const html = htm.bind(h);

export const Login = () => {
  const { login, user: u } = useAuthContext();

  const [user, setUser] = useState({ email: '', password: '' });

  const onChangeHandler = (event) => {
    setUser((s) => ({
      ...s,
      [event.target.name]: event.target.value,
    }));
  };

  // const loginHandler = () => {
  //   login(user.email, user.password).then(() => {
  //     console.log(u);
  //   });
  // };

  return html`
    <div id="page-login" class="app-page">
      <div class="login__logo-wrapper">
        <${CogniflowLogo} />
      </div>
      <section class="login__form-section">
        <div class="login__form-wrapper">
          <p class="cogni__title mb-md">Log in to continue</p>
          <div class="px-sm" id="login-default-form">
            <div class="login__form-field mb-sm">
              <p class="cogni__md-text wg-md">Email</p>
              <input
                id="login-email-field"
                class="cogni__form-input w-100"
                placeholder="Your email"
                type="email"
                required
                onChange=${onChangeHandler}
                name="email"
              />
            </div>
            <div class="login__form-field mb-sm">
              <p class="cogni__md-text wg-md">Password</p>
              <input
                id="login-password-field"
                class="cogni__form-input w-100"
                placeholder="Password"
                type="password"
                onChange=${onChangeHandler}
                required
                name="password"
              />
            </div>
            <div class="login__form-field">
              <p
                class="cogni__link cogni__text-xs login__secret-token-link"
                id="login-go-to-secret"
              >
                <!-- Use a secret token instead -->
              </p>
            </div>

            <div class="login__form-field mt-sm">
              <button
                id="default-login-button"
                class="w-100 cogni__type__main py-sm login__form-button"
                type="button"
              >
                Login
              </button>

              <p class="mt-sm login-error" id="login-invalid-creds">
                Invalid credentials, please try again
              </p>
            </div>
            <p class="cogni__sm-text" style="margin-top: 12px; color: #949494">
              You need to have a Cogniflow password to access our Excel Add-in,
              if you don't have one, create it
              <a
                href="https://app.cogniflow.ai/settings/profile"
                target="_blank"
                style="margin-left: 4px"
                >here</a
              >
            </p>
          </div>
          <div class="px-sm d-none" id="login-use-secret-token">
            <div class="login__form-field mb-sm">
              <p class="cogni__md-text wg-md">Authentication token</p>
              <input
                class="cogni__form-input w-100"
                placeholder="Ask for your access token"
                required
              />
            </div>
            <div class="login__form-field">
              <p
                class="cogni__link cogni__text-xs login__secret-token-link"
                id="login-go-to-normal-auth"
              >
                Use normal authentication instead
              </p>
            </div>
            <div class="login__form-field mt-sm">
              <button
                id="default-login-button"
                class="w-100 cogni__type__main py-sm login__form-button"
                type="button"
              >
                Login using token
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  `;
};
