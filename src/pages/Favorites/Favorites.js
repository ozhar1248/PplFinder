import React, { useEffect, useState } from "react";
import Text from "components/Text";
import * as S from "./style";
import IconButton from "@material-ui/core/IconButton";
import FavoriteIcon from "@material-ui/icons/Favorite";

//
const Favorites = () => {
  const [users, setUsers] = useState(
    JSON.parse(localStorage.getItem("favorites") || "[]")
  );

  const handleClickFav = (user) => {
    setUsers((prevList) => prevList.filter((userItem) => userItem.email !== user.email));
  };

  useEffect(() => {
    localStorage.setItem("favorites", JSON.stringify(users));
  }, [users]);

  return (
    <S.Favorites>
      <S.Content>
        <S.Header>
          <Text size="64px" bold>
            Favorites
          </Text>
        </S.Header>
        <S.UserList>
          <S.List>
            {users.map((user, index) => {
              return (
                <S.User
                  key={index}
                >
                  <S.UserPicture src={user?.picture.large} alt="" />
                  <S.UserInfo>
                    <Text size="22px" bold>
                      {user?.name.title} {user?.name.first} {user?.name.last}
                    </Text>
                    <Text size="14px">{user?.email}</Text>
                    <Text size="14px">
                      {user?.location.street.number} {user?.location.street.name}
                    </Text>
                    <Text size="14px">
                      {user?.location.city} {user?.location.country}
                    </Text>
                  </S.UserInfo>
                  <S.IconButtonWrapper
                    isVisible={true}
                    onClick={() => {
                      handleClickFav(user);
                    }}
                  >
                    <IconButton>
                      <FavoriteIcon color="error" />
                    </IconButton>
                  </S.IconButtonWrapper>
                </S.User>
              );
            })}
          </S.List>
        </S.UserList>
      </S.Content>
    </S.Favorites>
  );
};

export default Favorites;
