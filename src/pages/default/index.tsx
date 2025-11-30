import Text from "../../components/ui/text/text";
import { useTheme } from "../../context/theme";
// import "./style.css"

export default function Default() {
  const {
    theme: {
      colors: { text },
    },
  } = useTheme();

  return (
    <div className="container">
      <Text
        style={{
          color: text,
          fontSize: "2.5rem",
          marginBottom: "0.5rem",
        }}
        en="Welcome to CMS CG"
        ar="مرحبا بكم في CMS CG"
      />

      <Text
        style={{
          fontSize: "1.25rem",
        }}
        en=" You're exploring the development alpha v0.0.1. Stay tuned for
                exciting updates and features in this correspondence management
                system!"
        ar="أنت تستكشف التطوير ألفا v0.0.1. ترقبوا
                تحديثات وميزات مثيرة في إدارة المراسلات هذه
                نظام!"
      />
    </div>
  );
}

/*
.container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100vh;
    background-color: var(--bg-color);
    font-family: 'Arial, sans-serif';
}

.title {
    
}

.description {
    color: var(--text-color);
    font-size: 1.25rem;
    text-align: center;
    max-width: 600px;
}
    */
