import { useState } from "react"
import { Button, Card, Container, Form } from "react-bootstrap"
import { login } from "../services/auth-service"
import { USER_ID } from "../constants"

type Props = {
    handleIsLoggedIn: (value: boolean) => void;
}

const Login = (props: Props) => {
    const { handleIsLoggedIn } = props
    const [username, setUsername] = useState("")
    const [password, setPassworde] = useState("")

    async function handleLogin(e: any) {
        e.preventDefault()
        const res = await login({
            username,
            password
        })
        localStorage.setItem(USER_ID, res.data.id)
        handleIsLoggedIn(true)
    }

    return (
        <Container className="d-flex align-items-center pt-4" >
            <Card className="p-5" style={{ width: "100%" }}>
                <Form onSubmit={handleLogin}>
                    <Form.Group className="mb-3" >
                        <Form.Label>Username</Form.Label>
                        <Form.Control
                            placeholder="username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)} />
                    </Form.Group>
                    <Form.Group className="mb-3" >
                        <Form.Label>Password</Form.Label>
                        <Form.Control
                            type="password"
                            placeholder="password"
                            onChange={(e) => setPassworde(e.target.value)}
                        />
                    </Form.Group>
                    <div className="d-flex justify-content-center">
                        <Button
                            disabled={!username || !password}
                            type="submit"
                        >Login</Button>
                    </div>
                </Form>
            </Card>
        </Container>
    )
}

export default Login