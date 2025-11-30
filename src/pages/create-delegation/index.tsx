import ButtonComponent from "@/components/ui/button";
import { useLanguage } from "@/context/language";
import { PlusOutlined } from "@ant-design/icons";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import UserRoles from "./components/user-roles";
import {
  CreateDelegationAdminType,
  createDelegationSchema,
} from "../delegationa-admin/schema";
import TitleBar from "@/components/ui/bar/title-bar";
import { DelegationRecord } from "./types";
import { useEffect, useState } from "react";
import CreateDelegationForm from "./components/create-delegation-form";
import FadeInWrapperAnimation from "@/animations/fade-in-wrapper-animation";
import {
  createAdminDelegation,
  createAdminDelegationBody,
  getUserRoles,
  UserRole,
} from "../delegationa-admin/service";
import DelegationTable from "./components/table";
import ActionMenuItem from "@/components/ui/menu-item";
import { useNavigate } from "react-router-dom";
import useHandleError from "@/components/hooks/useHandleError";
import useCustomMessage from "@/components/hooks/use-message";

const CreateDelegation = () => {
  const { showMessage } = useCustomMessage();

  const { handleError } = useHandleError();
  const navigate = useNavigate();
  const { labels, isEnglish } = useLanguage();
  const [delegations, setDelegations] = useState<DelegationRecord[]>([]);
  const [openModal, setOpenModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [userRoles, setUserRoles] = useState<UserRole[]>([]);
  const [editedDelegation, setEditedDelegation] =
    useState<DelegationRecord | null>(null);

  const methods = useForm<CreateDelegationAdminType>({
    resolver: zodResolver(createDelegationSchema),
    mode: "all",
    defaultValues: {
      delegate_all: true,
    },
  });

  const {
    watch,
    getValues,
    formState: { isValid },
  } = methods;

  const { delegator_user_id, delegate_all, delegate_to_user_id } = watch();

  const handleCreateDelegation = async () => {
    try {
      setLoading(true);

      const { date_from, date_to, delegate_to_user_id } = getValues();

      const delegateTo1 = [
        {
          delegate_to_user_id: delegate_to_user_id || 0,
          entity_delegation: undefined,
        },
      ];
      const delegateTo2 = delegations?.map((d) => ({
        delegate_to_user_id: Number(d?.delegate_to_user_id),
        entity_delegation: d?.entity_delegation,
      }));

      const body: createAdminDelegationBody = {
        date_from,
        date_to,
        delegator_user_id,
        delegate_all,
        delegate_to: delegate_all ? delegateTo1 : delegateTo2,
      };
      const res = await createAdminDelegation(body);

      if (res) {
        showMessage("success", labels.msg.create_success);
        navigate("/admin/delegation", { replace: true });
      }
    } catch (e) {
      handleError(e);
    } finally {
      setLoading(false);
    }
  };

  const fetchRoles = async () => {
    const res = await getUserRoles(delegator_user_id);
    if (res) {
      setUserRoles(res);
    }
  };

  useEffect(() => {
    if (!delegator_user_id) return;
    fetchRoles();
  }, [delegator_user_id]);
  const checkValidiation =
    isValid &&
    (delegate_all ? Boolean(delegate_to_user_id) : delegations?.length > 0);
  return (
    <>
      <TitleBar headerText={labels.mnu.create_delegation} />
      <div style={{ direction: !isEnglish ? "rtl" : "ltr" }}>
        <FormProvider {...methods}>
          <CreateDelegationForm len={delegations?.length || 0} />
        </FormProvider>
        {!delegate_all && Boolean(delegator_user_id) && (
          <FadeInWrapperAnimation
            enableScaleAnimation={false}
            style={{ marginTop: 8 }}
          >
            <ActionMenuItem
              onClick={() => {
                setOpenModal(true);
              }}
              isActive={true}
              label={labels.btn.add_new}
              type="add"
            />
            <DelegationTable
              data={delegations}
              handleEdit={(data) => {
                setEditedDelegation(data);
                setOpenModal(true);
              }}
              setDelegations={setDelegations}
            />
          </FadeInWrapperAnimation>
        )}
        <div style={{ marginTop: 25 }}>
          <ButtonComponent
            disabled={!checkValidiation}
            icon={<PlusOutlined />}
            buttonLabel={labels.btn.create}
            type="primary"
            onClick={handleCreateDelegation}
            spinning={loading}
          />
        </div>
      </div>
      {openModal && (
        <UserRoles
          roles={userRoles}
          editedDelegation={editedDelegation}
          editingId={editedDelegation?.id}
          setDelegations={setDelegations}
          delegations={delegations}
          onClose={() => {
            setOpenModal(false);
            setEditedDelegation(null);
          }}
        />
      )}
    </>
  );
};

export default CreateDelegation;
