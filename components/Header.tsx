"use client";
import Link from "next/link";
import styled from "styled-components";
import { Search, ShoppingCart } from "lucide-react";

const HeaderContainer = styled.header`
  width: 100%;
  position: sticky;
  top: 0;
  z-index: 50;
  background-color: #0a0a0a;
  color: white;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
`;

const HeaderContent = styled.div`
  max-width: 1280px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 24px;
`;

const SearchBox = styled.div`
  display: flex;
  align-items: center;
  background-color: #1a1a1a;
  border-radius: 6px;
  padding: 8px 12px;
  width: 100%;
  max-width: 500px;
  margin: 0 24px;

  input {
    background: transparent;
    border: none;
    outline: none;
    color: #e5e5e5;
    font-size: 0.9rem;
    width: 100%;
    margin-left: 8px;
  }

  svg {
    color: #9ca3af;
  }
`;

const AuthArea = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;

  .login-links {
    font-size: 0.8rem;
    text-align: right;

    a {
      color: white;
      text-decoration: none;
      font-weight: 500;
      transition: color 0.2s;

      &:hover {
        color: #9ca3af;
      }
    }

    span {
      color: #9ca3af;
      margin: 0 4px;
    }
  }

  svg {
    cursor: pointer;
    transition: color 0.2s;

    &:hover {
      color: #9ca3af;
    }
  }
`;

export default function Header() {
	return (
		<HeaderContainer>
			<HeaderContent>
				<Link href="/">
					<h1>Elementx Fitness</h1>
				</Link>

				<SearchBox>
					<Search size={16} />
					<input type="text" placeholder="Busque na Loja" />
				</SearchBox>

				<AuthArea>
					<div className="login-links">
						<Link href="/login">Entre</Link>
						<span>ou</span>
						<Link href="/register">Cadastre-se</Link>
					</div>
          <Link href="/login">
						<ShoppingCart size={20} />
					</Link>
				</AuthArea>
			</HeaderContent>
		</HeaderContainer>
	);
}
