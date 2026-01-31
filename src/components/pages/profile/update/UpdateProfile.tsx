import { type FC, useEffect, useRef, useState } from "react";
import scss from "./UpdateProfile.module.scss";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useGetMe, useUpdateProfile } from "@/api/user";

interface ProfileProps {
  onClose: () => void;
}

const UpdateProfile: FC<ProfileProps> = ({ onClose }) => {
  const { register, handleSubmit, reset, setValue } =
    useForm<AUTH.UpdateProfileReq>();
  const { mutateAsync: updateProfileMutation, isPending } = useUpdateProfile();
  const { data: getMe } = useGetMe();

  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (getMe?.user) {
      reset({
        name: getMe.user.name,
        phone: getMe.user.phone,
        avatar: getMe.user.avatar || "",
      });
      setAvatarPreview(getMe.user.avatar);
    }
  }, [getMe, reset]);

  const onSubmit = async (data: AUTH.UpdateProfileReq) => {
    try {
      await updateProfileMutation(data);
      toast.success("Профиль обновлен 🎉");
      onClose();
    } catch (error) {
      console.error(error);
      toast.error("Ошибка, повторите попытку позже");
    }
  };

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className={scss.content}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className={scss.avatarWrapper}>
          <img
            src={avatarPreview || "/default-avatar.png"}
            alt="avatar"
            className={scss.avatar}
            style={{ cursor: "pointer" }}
          />

          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            style={{ display: "none" }}
          />

          <input
            type="text"
            placeholder="Ссылка на аватар"
            {...register("avatar")}
            value={avatarPreview || ""}
            onChange={(e) => {
              setAvatarPreview(e.target.value);
              setValue("avatar", e.target.value);
            }}
            className={scss.avatarInput}
          />
        </div>

        <input type="text" placeholder="Новое имя" {...register("name")} />
        <input
          type="text"
          placeholder="Новый номер телефона"
          {...register("phone")}
        />

        <div className={scss.buttons}>
          <button
            className={scss.btnEditSave}
            type="submit"
            disabled={isPending}
          >
            {isPending ? "Сохраняем..." : "Обновить профиль"}
          </button>
          <button type="button" className={scss.cancelBtn} onClick={onClose}>
            Отмена
          </button>
        </div>
      </form>
    </div>
  );
};

export default UpdateProfile;
