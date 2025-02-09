import { useContext, useRef, useState } from "react";
import { Button, Modal, Box, Grid, TextField } from "@mui/material";
import { UserContext } from "./Homee";
import axios from "axios";
import { pink, grey } from '@mui/material/colors';
const modalStyle = { position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: 400, bgcolor: grey[100], border: '2px solid #000', boxShadow: 24, p: 4, };
const buttonStyle = {
    backgroundColor: pink[200],
    transition: '0.3s',
    '&:hover': {
        backgroundColor: grey[500],
    },
};
const Login = ({ onLoginSuccess }: { onLoginSuccess: Function }) => {
    const [open, setOpen] = useState(false);
    const context = useContext(UserContext);
    const nameRef = useRef<HTMLInputElement>(null);
    const passwordRef = useRef<HTMLInputElement>(null);
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!nameRef.current?.value || !passwordRef.current?.value) {
            alert("נא למלא את שם המשתמש והסיסמה");
            return;
        }
        try {
            const res = await axios.post('http://localhost:3000/api/user/login', {
                name: nameRef.current?.value,
                password: passwordRef.current?.value
            });
            if (context) {
                setOpen(false);
                context.userDispatch({
                    type: 'CREATE',
                    data: {
                        id: res.data.user.id,
                        firstName: nameRef.current?.value || '',
                        password: passwordRef.current?.value || ''
                    }
                });


            }

            onLoginSuccess();
        } catch (e: any) {
            if (e.response?.status === 401) {
                setOpen(false);
                alert('שם או סיסמא לא תקינים');
            }
        }
    };
    return (
        <>
            <div style={{
                display: 'flex',
                flexDirection: 'row',
                gap: '16px',
                position: 'absolute',
                top: '16px',
                left: '16px'
            }}>
                <Button
                    variant="contained" onClick={() => setOpen(true)} sx={buttonStyle}>
                    Login
                </Button></div>

            <Modal open={open} aria-labelledby="login-modal">
                <Box sx={modalStyle}>
                    <form>
                        <Grid container spacing={2} direction="column">
                            <Grid item>
                                <TextField inputRef={nameRef} label="שם משתמש" variant="outlined" fullWidth required />
                            </Grid>
                            <Grid item>
                                <TextField inputRef={passwordRef} label="סיסמא" type="password" variant="outlined" fullWidth required />
                            </Grid>
                            <Grid item>
                                <Button variant="contained" fullWidth onClick={handleSubmit} sx={buttonStyle}>Login</Button>
                            </Grid>
                        </Grid>
                    </form>
                </Box>
            </Modal>
        </>
    );
};
export default Login;

