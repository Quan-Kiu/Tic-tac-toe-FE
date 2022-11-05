import { useRef } from 'react';
import { useDispatch } from 'react-redux';
import { login, AuthState } from '../../store/authSlice';
import cssModule from './LoginPage.module.scss';
import { v4 as uuidv4 } from 'uuid';


interface LoginPageProps {

}

const LoginPage = (props: LoginPageProps) => {
    const styles: any = cssModule;
    const inputRef = useRef<HTMLInputElement>(null);
    const dispatch = useDispatch();

    const handleOnLogin = () => {
        if (!inputRef.current) return;

        const value = inputRef.current.value;

        if (value.length < 4) return;
        const payload: AuthState = { name: value, id: uuidv4() }
        dispatch(login(payload));

    }

    return (
        <div className={[styles.container].join(' ')}>

            <div className={styles.loginForm}>

                <input ref={inputRef} autoFocus type="text" placeholder='Your name' className={styles.nameInput} />

                <button onClick={handleOnLogin} className={styles.loginButton}>Join Now</button>

            </div>
        </div>
    )
}

export default LoginPage