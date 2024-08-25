'use client'
import { useRouter } from "next/navigation";
import styles from "./page.module.css";
import Button from '@mui/material/Button';



export default function Home() {
  const router = useRouter();
  return (
    <main className={styles.main}>
      <div>
        <h1 style={{ backgroundColor: 'white', padding: '10px', borderRadius: '10px', fontSize: '50px' }}>Welcome to Next Login</h1>
        <Button variant="contained"
          sx={{ backgroundColor: 'red', 
                color: 'white',
                '&:hover': {
                  backgroundColor: 'red',
                  color: 'white'
                },
                width:'100%',
                maxWidth: '500px',
                margin: 'auto',
                display: 'block',
                marginTop: '20px',
                padding: '10px',
                borderRadius: '10px'
              }}
          onClick={() => router.push('/login')}
        >
          LOGIN / REGISTER
        </Button>
      </div>
    </main>
  );
}
