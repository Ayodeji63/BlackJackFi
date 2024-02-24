import React from 'react'
import { useAuth } from '../../utils/common/AuthProvider';
import { StyledBtn } from '../../components/App/App.styled';
import userbase from 'userbase-js';
import { useNavigate } from 'react-router-dom';
import { ModalTypes } from '../../types.ds';
import { game } from '../../store/game';

export const Dashboard = () => {
    const {user, logout} = useAuth();
    const navigate = useNavigate();

    function handleLogout() {
      try {
        userbase
          .signOut()
          .then(() => {
            // user logged out
            console.log("User logged out!");
            logout();
            // router.push("/");
            navigate("/")
        game.modalUpdate(false, ModalTypes.SignUp);

          })
          .catch((e: any) => console.error(e));

      } catch (error: any) {
        console.log(error);
      }
    }

  return (
    <div className='w-full h-full'>
        <header className='w-full flex justify-around p-5'>
            <div>Dashboard</div>
            <div>
                <p>Username: {user?.username}</p>
                <p>UserWallet Address: {user?.scwAddress}</p>
            </div>

        </header>

        <section>
        <StyledBtn
        type="submit"
        className="button buttonBlue"
      >
        Create Table
      </StyledBtn>

      <StyledBtn
        type="submit"
        className="button buttonBlue"
        onClick={handleLogout}
      >
       Logout
      </StyledBtn>
        </section>
    </div>
  )
}
