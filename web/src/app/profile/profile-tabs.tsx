"use client";

import { updateProfileDetails } from "@/app/_actions/auth-actions";
import { Logo } from "@/components/base";
import { KreditOptionsModal } from "@/components/elements";
import { ChangePasswordFields } from "@/components/forms";
import { Button } from "@/components/ui/button";
import EmptyState from "@/components/ui/empty-state";
import { Input } from "@/components/ui/input";
import Loader from "@/components/ui/loader";
import useCustomTabsHook from "@/hooks/use-custom-tabs";
import { whileTabInView } from "@/lib/constants";
import { MessagesIcon, PhoneIcon, UserIcon } from "@/lib/icons";
import { capitalize, cn, compareObjects, notify } from "@/lib/utils";
import { useDisclosure } from "@heroui/react";

import { CameraIcon } from "@/lib/icons";
import { Avatar } from "@/components/base";
import ProfilePictureUploader from "@/components/base/image-uploader";
import { toast } from "@/hooks/use-toast";
import { LogOutPrompt } from "@/components/elements/navbar";

import {
  Card,
  CardBody,
  CardHeader,
  Checkbox,
  Switch,
  Tab,
  Table,
  TableBody,
  TableColumn,
  TableHeader,
  Tabs,
} from "@heroui/react";
import { useQueryClient } from "@tanstack/react-query";

import { AnimatePresence, motion } from "framer-motion";
import { useSearchParams } from "next/navigation";
import React, { useEffect } from "react";

const PROFILE_TABS = [
  {
    title: "Profile",
    key: 0,
  },
  {
    title: "Notifications",
    key: 1,
  },
  {
    title: "Security",
    key: 2,
  },
  {
    title: "Kredits & Subscriptions",
    key: 3,
  },
];

export default function AccountProfilePage({ user }) {
  // only fetch user profile from cookies

  const searchParams = useSearchParams();
  const isKreditsTab = Boolean(searchParams.get("tab") == "kredits");

  const {
    currentTabIndex,
    activeTab,
    navigateTo,
    navigateForward,
    navigateBackwards,
    isLoading,
  } = useCustomTabsHook([
    <AccountDetails key={"account-details"} user={user} />,
    <CommunicationAndNotifications key={"notifications"} user={user} />,
    <SecurityDetails key={"security-details"} />,
    <Subscriptions user={user} key={"subscriptions-details"} />,
  ]);

  useEffect(() => {
    if (isKreditsTab) {
      navigateTo(3);
      // router.push("/profile?kredits", { scroll: false, shallow: true });
    }
  }, []);

  return (
    <Card className="flex h-full w-full flex-1 flex-col shadow-none ">
      <CardHeader className="flex flex-wrap gap-4">
        <Tabs
          aria-label="Tabs"
          selectedKey={currentTabIndex}
          onSelectionChange={navigateTo}
          variant={"underlined"}
          color="primary"
          className=""
        >
          {PROFILE_TABS.map(({ title, key }, index) => (
            <Tab key={index} title={title} />
          ))}
        </Tabs>
      </CardHeader>
      <AnimatePresence mode="wait">
        <motion.div
          key={`current-tab-${currentTabIndex}`}
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -100 }}
          transition={{ duration: 0.2 }}
          className="flex flex-col gap-4 p-6"
        >
          {isLoading ? (
            <Loader
              removeWrapper
              className="my-10 flex items-center justify-center"
            />
          ) : (
            activeTab
          )}
        </motion.div>
      </AnimatePresence>
    </Card>
  );
}

export const renderFieldIcon = (Icon, name) => (
  <span className="hidden h-full min-h-12 w-full max-w-max items-center bg-gradient-to-b from-gray-100 via-gray-50/50 to-gray-100 px-4 py-1 text-foreground/70 text-gray-500 dark:from-secondary-600/50 dark:via-transparent dark:to-secondary-600/50 dark:text-foreground sm:flex">
    {!name ? (
      <Icon className="w-6 text-foreground/50 dark:text-foreground" />
    ) : (
      name || ""
    )}
  </span>
);

export function UserProfileAvatar({ user, classNames }) {
  const [imageFile, setImageFile] = React.useState(null);

  const { isOpen, onOpen, onClose } = useDisclosure();

  const {
    isOpen: logOutPromptOpen,
    onOpen: onOpenLogOutPrompt,
    onOpenChange: setOpenLogOutPrompt,
  } = useDisclosure();

  function handleFileSelect(e) {
    e?.preventDefault();
    setImageFile(null);
    const file = e?.target?.files?.[0];
    if (!file) return;

    if (file?.size > 2 * 1024 * 1024) {
      toast({
        title: "Error",
        description: "File size exceeded 2MB Limit",
        variant: "destructive",
      });
      return;
    }
    setImageFile(file);
    onOpen();
  }

  return (
    <>
      <div className="relative flex ">
        <Avatar
          isBordered
          src={user?.profilePicture}
          name={`${user?.firstName} ${user?.lastName}`}
          subText={capitalize(user?.role?.toLowerCase()) || "Tenant"}
          className="cursor-pointer rounded-2xl mr-2 aspect-square w-16 h-16 lg:w-20 lg:h-20 text-large"
          classNames={{
            avatar: "dark:text-white bg-secondary",
            userInfoWrapper: "flex gap-1",
            name: "text-lg lg:text-xl dark:text-white font-bold",
            subText: "text-sm lg:text-base font-medium dark:text-white/60",
          }}
          showUserInfo={true}
          showFallback={false}
        />

        <Button
          isIconOnly
          aria-label="update-profile-photo"
          size="sm"
          color="primary"
          variant="faded"
          // isDisabled
          className={"absolute left-12 scale-75 lg:left-16 lg:scale-85 -top-2"}
        >
          <label
            htmlFor="profile-photo"
            className="cursor-pointer hover:opacity-100 data-[hover=true]:opacity-100"
          >
            <CameraIcon />
          </label>
        </Button>
        <input
          id={"profile-photo"}
          name={"profile-photo"}
          type="file"
          accept="image/*"
          className={`hidden`}
          onChange={handleFileSelect}
        />

        <ProfilePictureUploader
          isOpen={isOpen}
          onClose={onClose}
          imageFile={imageFile}
          setImageFile={setImageFile}
        />
      </div>

      <LogOutPrompt
        isOpen={logOutPromptOpen}
        onOpen={onOpenLogOutPrompt}
        onOpenChange={setOpenLogOutPrompt}
      />
    </>
  );
}

export function AccountDetails({ user }) {
  const queryClient = useQueryClient();

  const [isLoading, setIsLoading] = React.useState(false);

  const [formData, setFormData] = React.useState(user);

  function handleChange(e) {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }

  React.useEffect(() => {
    if (user && (user?.firstName || user?.lastName)) {
      setFormData(user);
    }
  }, [user]);

  const noChangesToSave = compareObjects(user, formData);

  async function handleUserDetailsUpdate(e) {
    e.preventDefault();
    setIsLoading(true);
    setAllowRefetch(true);

    const cleanedData = {
      firstName: formData?.firstName,
      lastName: formData?.lastName,
      email: formData?.email,
      phone: formData?.phone,
      universityId: formData?.universityId || "N/A",
      dob: formData?.dob || "",
      isStudent: formData?.isStudent || false,
    };

    const response = await updateProfileDetails(cleanedData);

    if (response?.success) {
      queryClient.invalidateQueries();
      notify({
        title: "Update Success",
        description: "Profile Details updated successfully",
      });
    } else {
      notify({
        title: "Update Error",
        description: response?.message,
        variant: "destructive",
      });
    }

    setIsLoading(false);
    setAllowRefetch(false);
    return;
  }

  return (
    <div>
      <motion.div
        whileInView={whileTabInView}
        className="flex flex-col gap-4 my-4"
      >
        <div>
          <h4>Your Account Profile</h4>
          <p className="text-sm leading-6 text-foreground/60">
            You can edit the information you need here so we can keep your
            experience at the best level on TaskSync.
          </p>
        </div>

        <UserProfileAvatar user={user} />

        <form
          onSubmit={handleUserDetailsUpdate}
          className="flex flex-1 flex-col gap-4"
        >
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
            <h4 className="flex-[0.5] font-medium">Full Name</h4>
            <div className="flex flex-1 gap-4">
              <Input
                required
                placeholder={"First Name"}
                name={"firstName"}
                size="lg"
                value={formData?.firstName}
                onChange={handleChange}
                classNames={{
                  inputWrapper: "pl-0 overflow-clip",
                }}
                startContent={renderFieldIcon(UserIcon)}
              />
              <Input
                required
                placeholder={"Last Name"}
                name={"lastName"}
                size="lg"
                value={formData?.lastName}
                onChange={handleChange}
                classNames={{
                  inputWrapper: "pl-0 overflow-clip",
                }}
                startContent={renderFieldIcon(UserIcon)}
              />
            </div>
          </div>

          <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
            <h4 className="flex-[0.5] font-medium">Email</h4>
            <div className="flex flex-1 gap-4">
              <Input
                required
                placeholder={"Email"}
                name={"email"}
                type={"email"}
                size="lg"
                value={formData?.email || ""}
                onChange={handleChange}
                classNames={{
                  inputWrapper: "pl-0 overflow-clip",
                }}
                startContent={renderFieldIcon(MessagesIcon)}
              />
            </div>
          </div>

          <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
            <h4 className="flex-[0.5] font-medium">Mobile Number</h4>
            <div className="flex flex-1 gap-4">
              <Input
                required
                placeholder={"Mobile Number"}
                name={"phone"}
                // type={"number"}
                size="lg"
                value={formData?.phone || ""}
                onChange={handleChange}
                classNames={{
                  inputWrapper: "pl-0 overflow-clip",
                }}
                startContent={renderFieldIcon(PhoneIcon)}
              />
            </div>
          </div>

          {/* <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
            <h4 className="flex-[0.5] font-medium">Date of Birth</h4>
            <div className="flex flex-1 gap-4">
              <DateSelectField
                name={"dob"}
                className="pl-0"
                disabled
                maxValue={today(getLocalTimeZone())}
                value={formData?.dob}
                onChange={(date) => {
                  setFormData((prev) => ({
                    ...prev,
                    dob: formatDate(date, "DD-MM-YYYY"),
                  }));
                }}
                size="lg"
                startContent={renderFieldIcon(CalendarHeartIcon)}
              />
            </div>
          </div> */}

          <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
            <h4 className="flex-[0.5] font-medium">Username</h4>
            <div className="flex flex-1 gap-4">
              <Input
                required
                placeholder={"Username"}
                name={"username"}
                className="pl-0"
                disabled
                classNames={{
                  inputWrapper: "pl-0 overflow-clip",
                }}
                size="lg"
                value={user?.username || ""}
                startContent={renderFieldIcon(undefined, "  taskSync.space/")}
                onChange={handleChange}
              />
            </div>
          </div>

          <Button
            type="submit"
            aria-label="profile-update-save"
            color="primary"
            variant={noChangesToSave ? "faded" : "solid"}
            isDisabled={noChangesToSave}
            className="mt-auto self-end justify-self-end"
            isLoading={isLoading}
            // onPress={handleUserDetailsUpdate}
          >
            Save Changes
          </Button>
        </form>
      </motion.div>
    </div>
  );
}

export function CommunicationAndNotifications({ user }) {
  const [isSelected, setIsSelected] = React.useState(false);
  return (
    <motion.div whileInView={whileTabInView} className="flex flex-col gap-6">
      <div>
        <h4>Communication Preference</h4>
        <p className="text-sm leading-6 text-foreground/60">
          You can edit the information you need here so we can keep your
          experience at the best level on TaskSync.
        </p>
      </div>

      <div className="flex flex-col gap-2 sm:flex-row">
        <h4 className="flex-[0.5] font-medium">Phone & Email</h4>
        <div className="flex flex-1 flex-col gap-4">
          <Input
            isDisabled
            placeholder="Phone Number"
            size="lg"
            value={user?.phone || ""}
            classNames={{
              inputWrapper: "pl-0 overflow-clip",
            }}
            startContent={renderFieldIcon(PhoneIcon)}
          />
          <Input
            isDisabled
            placeholder={"Email"}
            size="lg"
            classNames={{
              inputWrapper: "pl-0 overflow-clip",
            }}
            value={user?.email || ""}
            startContent={renderFieldIcon(MessagesIcon)}
          />
        </div>
      </div>

      <div className="flex flex-col gap-2 sm:flex-row">
        <h4 className="flex-[0.5] font-medium">Notifications</h4>
        <div className="flex flex-1 flex-col gap-4">
          <div className="flex flex-col gap-2">
            <Checkbox isSelected={isSelected} onValueChange={setIsSelected}>
              Email Notifications
            </Checkbox>
            <p className="text-xs text-default-500">
              Get Notifications for new listings and newsletter updates
            </p>
          </div>
          <div className="flex flex-col gap-2">
            <Checkbox isDisabled>SMS Notifications</Checkbox>
            <p className="text-xs text-default-500">
              You will be notified via SMS when a listing you wish for is
              available. [Coming Soon]
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export function SecurityDetails({}) {
  const [changePassword, setChangePassword] = React.useState(false);
  return (
    <motion.div whileInView={whileTabInView} className="flex flex-col gap-4">
      <div>
        <h4>Security Settings</h4>
        <p className="text-sm leading-6 text-foreground/60">
          Update your security settings to protect your account and data.
        </p>
      </div>

      <div className="divide-foreground-100 border-foreground-200 mt-6 space-y-6 divide-y border-t text-sm leading-6">
        <div
          className={cn("items-center pt-6 flex justify-between", {
            "items-start flex-col": changePassword,
          })}
        >
          <div className="flex flex-col text-base text-foreground sm:w-64 sm:flex-none lg:flex-1">
            Password
            <span className="text-sm text-foreground/50">
              Change your password
            </span>
          </div>
          {!changePassword ? (
            <>
              <span className="mt-1 flex justify-between gap-x-6 sm:mt-0 sm:flex-auto">
                <p className="text-foreground-900">************</p>
              </span>
              <button
                type="button"
                onClick={() => setChangePassword(true)}
                className="font-semibold text-primary hover:text-primary/80"
              >
                Change
              </button>
            </>
          ) : (
            <ChangePasswordFields
              changePassword={changePassword}
              setChangePassword={setChangePassword}
            />
          )}
        </div>
        {/* *************************************** */}
        <div className="items-center pt-6 opacity-50 sm:flex">
          <p className="font-medium text-foreground sm:w-64 sm:flex-none sm:pr-6">
            2F Authentication
          </p>
          <div className="mt-1 flex justify-between gap-x-6 sm:mt-0 sm:flex-auto">
            <div className="text-foreground-900 font-medium">
              [disabled] Coming Soon!
            </div>
            <Switch isDisabled />
          </div>
        </div>
        {/* *************************************** */}
      </div>
    </motion.div>
  );
}

export function Subscriptions({ user }) {
  const { isOpen, onClose, onOpen } = useDisclosure();

  const wallet = user?.wallet;
  return (
    <motion.div whileInView={whileTabInView} className="flex flex-col gap-4">
      <div>
        <h4>Kredit Information</h4>
        <p className="text-sm leading-6 text-foreground/60">
          Manage your kredits & subscription information.
        </p>
      </div>

      <div className="flex items-center justify-center">
        {wallet?.credits ? (
          <div className="flex h-full flex-1 flex-col gap-4 md:flex-row">
            {/* KREDITS COLUMN */}
            <div className="flex h-full w-full max-w-lg flex-1 flex-col gap-4">
              <div className="flex max-w-full items-center gap-3 rounded-xl border border-foreground/10 p-4">
                <Logo
                  className="relative"
                  width={40}
                  height={40}
                  isIcon
                  src={"/images/logo/logo-icon-light.svg"}
                />
                <div className="mr-auto flex flex-col">
                  <span className="text-sm font-semibold text-primary">
                    Kredit Balance
                  </span>
                  <span className="">
                    {wallet?.credits}{" "}
                    {Number(wallet?.credits) > 1 ? "Kredits" : "Kredit"}
                  </span>
                </div>
                <Button onPress={onOpen} size="sm">
                  Buy Kredits
                </Button>
              </div>
              <Card className="flex w-full max-w-lg flex-1 rounded-xl border border-foreground/5 shadow-none">
                <CardHeader className="font-semibold">
                  <div>
                    <h3>Recent Transactions</h3>
                  </div>
                </CardHeader>
                <CardBody>
                  {/* TABLE OF TRANSACTIONS FROM BEnd */}
                  <Table removeWrapper aria-label="Example empty table">
                    <TableHeader>
                      <TableColumn>DATE</TableColumn>
                      <TableColumn>DESCRIPTION</TableColumn>
                      <TableColumn>AMOUNT</TableColumn>
                      <TableColumn>STATUS</TableColumn>
                    </TableHeader>
                    <TableBody emptyContent={"No rows to display."}>
                      {[]}
                    </TableBody>
                  </Table>
                </CardBody>
              </Card>
            </div>
          </div>
        ) : (
          <EmptyState
            title="No Kredit Balance"
            description="You have no Kredits left to use. Please purchase more."
            width={412}
            height={400}
            classNames={{ image: "w-96 h-96" }}
            handleAction={() => {
              onOpen();
            }}
            buttonText={"Buy Kredits"}
          />
        )}
      </div>

      {/* MODAL COMPONENTS */}
      <KreditOptionsModal isOpen={isOpen} onClose={onClose} hideActionButtons />
    </motion.div>
  );
}
