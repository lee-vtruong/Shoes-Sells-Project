const modalMessageArea = document.getElementById('modalMessage');
document.addEventListener('DOMContentLoaded', function () {
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    const modalMessageArea = document.getElementById('modalMessage');

    const BASE_API_URL = 'https://shop.cyberlearn.vn';

    function setValidationState(input, feedbackElement, isValid, message = '') {
        if (isValid) {
            input.classList.remove('is-invalid');
            if (feedbackElement) {
                feedbackElement.textContent = '';
            }
        } else {
            input.classList.add('is-invalid');
            input.classList.remove('is-valid');
            if (feedbackElement) {
                feedbackElement.textContent = message;
            }
        }
    }

    function displayModalMessage(message, isSuccess = false) {
        if (modalMessageArea) {
            modalMessageArea.textContent = message;
            modalMessageArea.style.color = isSuccess ? 'green' : 'red';
        }
    }

    function clearFormValidationFeedback(form) {
        const inputs = form.querySelectorAll('.form-control, .form-check-input');
        inputs.forEach(input => {
            input.classList.remove('is-invalid', 'is-valid');
        });
        const feedbacks = form.querySelectorAll('.invalid-feedback');
        feedbacks.forEach(feedback => {
            feedback.textContent = '';
        });
        if (modalMessageArea) {
            modalMessageArea.textContent = '';
            modalMessageArea.style.color = 'red';
        }
    }

    function checkRequired(input, feedbackElement, message = 'Trường này không được bỏ trống.') {
        const value = input.value.trim();
        const isValid = value !== '';
        setValidationState(input, feedbackElement, isValid, message);
        return isValid;
    }

    function checkEmail(input, feedbackElement, message = 'Địa chỉ email không hợp lệ.') {
        const value = input.value.trim();
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        let isValid = true;
        let errorMessage = '';
        if (value === '') { isValid = false; errorMessage = 'Email không được bỏ trống.'; }
        else if (!emailRegex.test(value)) { isValid = false; errorMessage = message; }
        setValidationState(input, feedbackElement, isValid, errorMessage);
        return isValid;
    }

    function checkPasswordMatch(passwordInput, repeatPasswordInput, feedbackElement, message = 'Mật khẩu nhập lại không khớp.') {
        const passwordValue = passwordInput.value;
        const repeatPasswordValue = repeatPasswordInput.value;
        const isValid = passwordValue === repeatPasswordValue;
        if (repeatPasswordValue.trim() !== '' && !isValid) {
            setValidationState(repeatPasswordInput, feedbackElement, false, message);
            return false;
        } else {
            setValidationState(repeatPasswordInput, feedbackElement, true);
            return isValid;
        }
    }

    function checkCheckbox(checkboxInput, feedbackElement, message = 'Bạn phải đồng ý với các điều khoản.') {
        const isChecked = checkboxInput.checked;
        setValidationState(checkboxInput, feedbackElement, isChecked, message);
        return isChecked;
    }

    function checkUsernameFormat(input, feedbackElement) {
        const value = input.value.trim();
        const usernameRegex = /^[a-zA-Z0-9._-]+$/;
        let isValid = true;
        let errorMessage = '';
        if (value === '') { isValid = false; }
        else if (!usernameRegex.test(value)) { isValid = false; errorMessage = 'Tên người dùng chỉ được chứa chữ cái (không dấu), số, dấu chấm (.), gạch dưới (_) và gạch nối (-).'; setValidationState(input, feedbackElement, isValid, errorMessage); }
        else { setValidationState(input, feedbackElement, true); }
        return isValid;
    }

    function checkPasswordComplexity(input, feedbackElement) {
        const value = input.value;
        const minLength = 8;
        const hasUppercase = /[A-Z]/.test(value);
        const hasLowercase = /[a-z]/.test(value);
        const hasDigit = /[0-9]/.test(value);
        const hasSpecialChar = /[^a-zA-Z0-9]/.test(value);
        let isValid = true;
        let errorMessage = '';
        if (value === '') { isValid = false; }
        else if (value.length < minLength) { isValid = false; errorMessage = `Mật khẩu phải có ít nhất ${minLength} ký tự.`; }
        else if (!hasUppercase || !hasLowercase || !hasDigit || !hasSpecialChar) { isValid = false; errorMessage = 'Mật khẩu phải có ít nhất 8 ký tự, bao gồm chữ hoa, chữ thường, số và ký tự đặc biệt.'; }
        setValidationState(input, feedbackElement, isValid, errorMessage);
        return isValid;
    }

    async function signupUser(userData) {
        displayModalMessage('Đang xử lý đăng ký...', false);
        try {
            const response = await fetch(`${BASE_API_URL}/api/Users/signup`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(userData)
            });

            const responseData = await response.json();

            if (response.ok) {
                console.log('API Đăng ký thành công:', responseData);
                displayModalMessage('Đăng ký tài khoản thành công! Bạn có thể đăng nhập ngay bây giờ.', true);

                const loginTabButton = document.getElementById('nav-home-tab');
                if (loginTabButton) {
                    const tab = new bootstrap.Tab(loginTabButton);
                    tab.show();
                    if (registerForm) registerForm.reset();
                    clearFormValidationFeedback(registerForm);
                }

            } else {
                console.error('Lỗi từ API Đăng ký:', response.status, responseData);
                let errorMessage = 'Đăng ký thất bại. Đã xảy ra lỗi.';
                if (responseData && responseData.message) {
                    errorMessage = responseData.message;
                } else if (response.status === 409) {
                    errorMessage = 'Email này đã tồn tại. Vui lòng sử dụng email khác.';
                } else if (response.status === 400) {
                    errorMessage = 'Dữ liệu đăng ký không hợp lệ. Vui lòng kiểm tra lại thông tin.';
                } else {
                    errorMessage = `Lỗi API: ${response.status} ${response.statusText}`;
                }
                displayModalMessage(errorMessage, false);
            }
        } catch (error) {
            console.error('Lỗi kết nối API Đăng ký:', error);
            displayModalMessage('Không thể kết nối đến máy chủ. Vui lòng thử lại sau.', false);
        }
    }

    async function signinUser(userData) {
        displayModalMessage('Đang xử lý đăng nhập...', false);
        try {
            const response = await fetch(`${BASE_API_URL}/api/Users/signin`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(userData)
            });

            const responseData = await response.json();

            if (response.ok) {
                console.log('API Đăng nhập thành công:', responseData);
                displayModalMessage('Đăng nhập thành công!', true);

                if (responseData && responseData.content && responseData.content.accessToken) {
                    localStorage.setItem('userToken', responseData.content.accessToken);
                    localStorage.setItem('userData', JSON.stringify(responseData.content));

                    const modalElement = document.getElementById('staticBackdrop');
                    const modal = bootstrap.Modal.getInstance(modalElement);
                    if (modal) modal.hide();

                } else {
                    displayModalMessage('Đăng nhập thành công nhưng không nhận được thông tin phiên đăng nhập.', false);
                }

            } else {
                console.error('Lỗi từ API Đăng nhập:', response.status, responseData);
                let errorMessage = 'Đăng nhập thất bại. Vui lòng kiểm tra lại.';
                if (responseData && responseData.message) {
                    errorMessage = responseData.message;
                } else if (response.status === 400 || response.status === 401) {
                    errorMessage = 'Email hoặc mật khẩu không đúng. Vui lòng kiểm tra và nhập lại.';
                } else {
                    errorMessage = `Lỗi API: ${response.status} ${response.statusText}`;
                }
                displayModalMessage(errorMessage, false);
            }
        } catch (error) {
            console.error('Lỗi kết nối API Đăng nhập:', error);
            displayModalMessage('Không thể kết nối đến máy chủ. Vui lòng thử lại sau.', false);
        }
    }

    if (loginForm) {
        loginForm.addEventListener('submit', async function (event) {
            event.preventDefault();
            clearFormValidationFeedback(loginForm);

            const loginNameInput = document.getElementById('loginName');
            const loginPasswordInput = document.getElementById('loginPassword');
            const loginNameFeedback = document.getElementById('loginNameFeedback');
            const loginPasswordFeedback = document.getElementById('loginPasswordFeedback');

            const isNameValid = checkRequired(loginNameInput, loginNameFeedback, 'Vui lòng nhập email hoặc tên đăng nhập.');
            const isPasswordValid = checkRequired(loginPasswordInput, loginPasswordFeedback, 'Vui lòng nhập mật khẩu.');

            const isFormValid = isNameValid && isPasswordValid;

            if (isFormValid) {
                console.log('Form Đăng nhập hợp lệ client-side. Chuẩn bị gọi API.');
                const loginData = {
                    email: loginNameInput.value.trim(),
                    password: loginPasswordInput.value
                };

                await signinUser(loginData);

            } else {
                console.log('Form Đăng nhập không hợp lệ client-side.');
            }

            loginNameInput.removeEventListener('blur', handleLoginNameBlur);
            loginPasswordInput.removeEventListener('blur', handleLoginPasswordBlur);
            loginNameInput.addEventListener('blur', handleLoginNameBlur);
            loginPasswordInput.addEventListener('blur', handleLoginPasswordBlur);
        });

        const handleLoginNameBlur = () => checkRequired(document.getElementById('loginName'), document.getElementById('loginNameFeedback'), 'Vui lòng nhập email hoặc tên đăng nhập.');
        const handleLoginPasswordBlur = () => checkRequired(document.getElementById('loginPassword'), document.getElementById('loginPasswordFeedback'), 'Vui lòng nhập mật khẩu.');

        const loginTabButton = document.getElementById('nav-home-tab');
        if (loginTabButton) {
            loginTabButton.addEventListener('shown.bs.tab', () => {
                clearFormValidationFeedback(loginForm);
                loginForm.reset();
            });
        }
    }

    if (registerForm) {
        registerForm.addEventListener('submit', async function (event) {
            event.preventDefault();
            clearFormValidationFeedback(registerForm);

            const registerNameInput = document.getElementById('registerName');
            const registerUsernameInput = document.getElementById('registerUsername');
            const registerEmailInput = document.getElementById('registerEmail');
            const registerPasswordInput = document.getElementById('registerPassword');
            const registerRepeatPasswordInput = document.getElementById('registerRepeatPassword');
            const registerCheckInput = document.getElementById('registerCheck');

            const registerNameFeedback = document.getElementById('registerNameFeedback');
            const registerUsernameFeedback = document.getElementById('registerUsernameFeedback');
            const registerEmailFeedback = document.getElementById('registerEmailFeedback');
            const registerPasswordFeedback = document.getElementById('registerPasswordFeedback');
            const registerRepeatPasswordFeedback = document.getElementById('registerRepeatPasswordFeedback');
            const registerCheckFeedback = document.getElementById('registerCheckFeedback');

            const isNameValid = checkRequired(registerNameInput, registerNameFeedback, 'Vui lòng nhập tên.');

            let isUsernameValid = checkRequired(registerUsernameInput, registerUsernameFeedback, 'Vui lòng nhập tên người dùng.');
            if (isUsernameValid) {
                isUsernameValid = checkUsernameFormat(registerUsernameInput, registerUsernameFeedback);
            }

            let isEmailValid = checkRequired(registerEmailInput, registerEmailFeedback, 'Vui lòng nhập email.');
            if (isEmailValid) {
                isEmailValid = checkEmail(registerEmailInput, registerEmailFeedback);
            }

            let isPasswordValid = checkRequired(registerPasswordInput, registerPasswordFeedback, 'Vui lòng nhập mật khẩu.');
            if (isPasswordValid) {
                isPasswordValid = checkPasswordComplexity(registerPasswordInput, registerPasswordFeedback);
            }

            let isRepeatPasswordValid = checkRequired(registerRepeatPasswordInput, registerRepeatPasswordFeedback, 'Vui lòng nhập lại mật khẩu.');
            if (isRepeatPasswordValid && registerPasswordInput.value.trim() !== '') {
                isRepeatPasswordValid = checkPasswordMatch(registerPasswordInput, registerRepeatPasswordInput, registerRepeatPasswordFeedback);
            }

            const isCheckboxValid = checkCheckbox(registerCheckInput, registerCheckFeedback);

            const isFormValid = isNameValid && isUsernameValid && isEmailValid && isPasswordValid && isRepeatPasswordValid && isCheckboxValid;

            if (isFormValid) {
                console.log('Form Đăng ký hợp lệ client-side. Chuẩn bị gọi API.');

                const signupData = {
                    email: registerEmailInput.value.trim(),
                    password: registerPasswordInput.value,
                    name: registerNameInput.value.trim(),
                };

                await signupUser(signupData);

            } else {
                console.log('Form Đăng ký không hợp lệ client-side.');
            }

            registerNameInput.removeEventListener('blur', handleRegisterNameBlur);
            registerUsernameInput.removeEventListener('blur', handleRegisterUsernameBlur);
            registerEmailInput.removeEventListener('blur', handleRegisterEmailBlur);
            registerPasswordInput.removeEventListener('blur', handleRegisterPasswordBlur);
            registerRepeatPasswordInput.removeEventListener('blur', handleRegisterRepeatPasswordBlur);
            registerCheckInput.removeEventListener('change', handleRegisterCheckChange);

            registerNameInput.addEventListener('blur', handleRegisterNameBlur);
            registerUsernameInput.addEventListener('blur', handleRegisterUsernameBlur);
            registerEmailInput.addEventListener('blur', handleRegisterEmailBlur);
            registerPasswordInput.addEventListener('blur', handleRegisterPasswordBlur);
            registerRepeatPasswordInput.addEventListener('blur', handleRegisterRepeatPasswordBlur);
            registerCheckInput.addEventListener('change', handleRegisterCheckChange);
        });

        const handleRegisterNameBlur = () => checkRequired(document.getElementById('registerName'), document.getElementById('registerNameFeedback'), 'Vui lòng nhập tên.');

        const handleRegisterUsernameBlur = () => {
            let isValid = checkRequired(document.getElementById('registerUsername'), document.getElementById('registerUsernameFeedback'), 'Vui lòng nhập tên người dùng.');
            if (isValid) {
                checkUsernameFormat(document.getElementById('registerUsername'), document.getElementById('registerUsernameFeedback'));
            }
        };

        const handleRegisterEmailBlur = () => {
            let isValid = checkRequired(document.getElementById('registerEmail'), document.getElementById('registerEmailFeedback'), 'Vui lòng nhập email.');
            if (isValid) {
                checkEmail(document.getElementById('registerEmail'), document.getElementById('registerEmailFeedback'));
            }
        };

        const handleRegisterPasswordBlur = () => {
            let isValid = checkRequired(document.getElementById('registerPassword'), document.getElementById('registerPasswordFeedback'), 'Vui lòng nhập mật khẩu.');
            if (isValid) {
                checkPasswordComplexity(document.getElementById('registerPassword'), document.getElementById('registerPasswordFeedback'));
            }
            const repeatPasswordInput = document.getElementById('registerRepeatPassword');
            if (repeatPasswordInput && repeatPasswordInput.value.trim() !== '') {
                checkPasswordMatch(document.getElementById('registerPassword'), repeatPasswordInput, document.getElementById('registerRepeatPasswordFeedback'));
            }
        };

        const handleRegisterRepeatPasswordBlur = () => {
            let isValid = checkRequired(document.getElementById('registerRepeatPassword'), document.getElementById('registerRepeatPasswordFeedback'), 'Vui lòng nhập lại mật khẩu.');
            if (isValid && document.getElementById('registerPassword').value.trim() !== '') {
                checkPasswordMatch(document.getElementById('registerPassword'), document.getElementById('registerRepeatPassword'), document.getElementById('registerRepeatPasswordFeedback'));
            }
        };

        const handleRegisterCheckChange = () => checkCheckbox(document.getElementById('registerCheck'), document.getElementById('registerCheckFeedback'));

        const registerTabButton = document.getElementById('nav-profile-tab');
        if (registerTabButton) {
            registerTabButton.addEventListener('shown.bs.tab', () => {
                clearFormValidationFeedback(registerForm);
                registerForm.reset();
            });
        }
    }

    const modalElement = document.getElementById('staticBackdrop');
    if (modalElement) {
        modalElement.addEventListener('hidden.bs.modal', () => {
            if (loginForm) clearFormValidationFeedback(loginForm);
            if (registerForm) clearFormValidationFeedback(registerForm);
        });
    }
});