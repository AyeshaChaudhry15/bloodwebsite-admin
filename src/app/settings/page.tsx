"use client";

import { useState, type ReactNode } from "react";
import {
  Settings,
  Globe,
  Mail,
  Bell,
  Shield,
  Database,
  Save,
  CheckCircle,
  Download,
  RefreshCw,
  Eye,
  EyeOff,
  Lock,
  Smartphone,
  AlertTriangle,
  Clock,
  FileText,
} from "lucide-react";

type SettingSection =
  | "general"
  | "site"
  | "email"
  | "notifications"
  | "security"
  | "backup";

export default function SettingsPage() {
  const [activeSection, setActiveSection] =
    useState<SettingSection>("general");

  const [saved, setSaved] = useState(false);

  const [generalData, setGeneralData] = useState({
    organizationName: "Patient Welfare Society",
    email: "info@pws.org",
    phone: "0300 1234567",
    website: "https://pws.org",
  });

  const [siteData, setSiteData] = useState({
    siteTitle: "Patient Welfare Society",
    tagline: "Saving Lives Through Blood Donation",
    address: "Lahore, Pakistan",
    timezone: "Asia/Karachi",
    language: "English",
  });

  const [emailData, setEmailData] = useState({
    smtpHost: "smtp.gmail.com",
    smtpPort: "587",
    username: "info@pws.org",
    password: "",
    senderName: "Patient Welfare Society",
    senderEmail: "info@pws.org",
  });

  const [notificationData, setNotificationData] = useState({
    newDonor: true,
    bloodRequest: true,
    donationReminder: true,
    emailNotification: true,
    smsNotification: false,
    adminAlert: true,
  });

  const [securityData, setSecurityData] = useState({
    twoFactor: false,
    loginAlert: true,
    sessionTimeout: "30",
  });

  const [showPassword, setShowPassword] = useState(false);

  const menuItems = [
    {
      id: "general" as SettingSection,
      title: "General",
      icon: Settings,
    },
    {
      id: "site" as SettingSection,
      title: "Site Information",
      icon: Globe,
    },
    {
      id: "email" as SettingSection,
      title: "Email Settings",
      icon: Mail,
    },
    {
      id: "notifications" as SettingSection,
      title: "Notifications",
      icon: Bell,
    },
    {
      id: "security" as SettingSection,
      title: "Security",
      icon: Shield,
    },
    {
      id: "backup" as SettingSection,
      title: "Backup",
      icon: Database,
    },
  ];

  const sectionInfo: Record<
    SettingSection,
    { title: string; description: string }
  > = {
    general: {
      title: "General Settings",
      description: "Manage your application settings",
    },
    site: {
      title: "Site Information",
      description: "Manage your website information",
    },
    email: {
      title: "Email Settings",
      description: "Configure your email and SMTP settings",
    },
    notifications: {
      title: "Notifications",
      description: "Manage your notification preferences",
    },
    security: {
      title: "Security",
      description: "Manage your account and security settings",
    },
    backup: {
      title: "Backup",
      description: "Manage your application backups",
    },
  };

  const handleSave = () => {
    setSaved(true);

    setTimeout(() => {
      setSaved(false);
    }, 2500);
  };

  const inputClass =
    "w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-red-400 focus:bg-white focus:ring-2 focus:ring-red-100";

  const labelClass =
    "mb-2 block text-sm font-medium text-slate-700";

  return (
    <div className="min-h-screen bg-[#f7f8fa] p-4 md:p-6">
      <div className="mx-auto max-w-[1400px]">

        <div className="mb-6">
          <h1 className="text-2xl font-bold text-slate-800">
            Settings
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Manage your application settings and preferences
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[260px_1fr]">

          <aside className="h-fit overflow-hidden rounded-xl border border-slate-200 bg-white">

            <div className="border-b border-slate-100 px-5 py-4">
              <h2 className="font-semibold text-slate-800">
                Settings
              </h2>
            </div>

            <div className="p-2">
              {menuItems.map((item) => {
                const Icon = item.icon;
                const active = activeSection === item.id;

                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveSection(item.id)}
                    className={`mb-1 flex w-full items-center gap-3 rounded-lg px-4 py-3 text-left text-sm font-medium transition ${
                      active
                        ? "bg-red-50 text-red-600"
                        : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                    }`}
                  >
                    <Icon
                      size={18}
                      strokeWidth={active ? 2.5 : 2}
                    />

                    <span>{item.title}</span>
                  </button>
                );
              })}
            </div>
          </aside>

          <main>

            <div className="mb-5">
              <h2 className="text-xl font-bold text-slate-800">
                {sectionInfo[activeSection].title}
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                {sectionInfo[activeSection].description}
              </p>
            </div>

            {activeSection === "general" && (
              <SettingsCard
                title="Organization Details"
                description="Update your organization's basic information"
              >
                <div className="grid grid-cols-1 gap-5 md:grid-cols-2">

                  <div>
                    <label className={labelClass}>
                      Organization Name
                    </label>

                    <input
                      className={inputClass}
                      value={generalData.organizationName}
                      onChange={(e) =>
                        setGeneralData({
                          ...generalData,
                          organizationName: e.target.value,
                        })
                      }
                    />
                  </div>

                  <div>
                    <label className={labelClass}>
                      Email
                    </label>

                    <input
                      type="email"
                      className={inputClass}
                      value={generalData.email}
                      onChange={(e) =>
                        setGeneralData({
                          ...generalData,
                          email: e.target.value,
                        })
                      }
                    />
                  </div>

                  <div>
                    <label className={labelClass}>
                      Phone
                    </label>

                    <input
                      className={inputClass}
                      value={generalData.phone}
                      onChange={(e) =>
                        setGeneralData({
                          ...generalData,
                          phone: e.target.value,
                        })
                      }
                    />
                  </div>

                  <div>
                    <label className={labelClass}>
                      Website
                    </label>

                    <input
                      className={inputClass}
                      value={generalData.website}
                      onChange={(e) =>
                        setGeneralData({
                          ...generalData,
                          website: e.target.value,
                        })
                      }
                    />
                  </div>

                </div>

                <SaveButton
                  saved={saved}
                  onClick={handleSave}
                />
              </SettingsCard>
            )}

            {activeSection === "site" && (
              <SettingsCard
                title="Website Information"
                description="Manage your website's basic information"
              >
                <div className="grid grid-cols-1 gap-5 md:grid-cols-2">

                  <div>
                    <label className={labelClass}>
                      Site Title
                    </label>

                    <input
                      className={inputClass}
                      value={siteData.siteTitle}
                      onChange={(e) =>
                        setSiteData({
                          ...siteData,
                          siteTitle: e.target.value,
                        })
                      }
                    />
                  </div>

                  <div>
                    <label className={labelClass}>
                      Tagline
                    </label>

                    <input
                      className={inputClass}
                      value={siteData.tagline}
                      onChange={(e) =>
                        setSiteData({
                          ...siteData,
                          tagline: e.target.value,
                        })
                      }
                    />
                  </div>

                  <div>
                    <label className={labelClass}>
                      Address
                    </label>

                    <input
                      className={inputClass}
                      value={siteData.address}
                      onChange={(e) =>
                        setSiteData({
                          ...siteData,
                          address: e.target.value,
                        })
                      }
                    />
                  </div>

                  <div>
                    <label className={labelClass}>
                      Timezone
                    </label>

                    <select
                      className={inputClass}
                      value={siteData.timezone}
                      onChange={(e) =>
                        setSiteData({
                          ...siteData,
                          timezone: e.target.value,
                        })
                      }
                    >
                      <option>Asia/Karachi</option>
                      <option>Asia/Dubai</option>
                      <option>Asia/Kolkata</option>
                      <option>UTC</option>
                    </select>
                  </div>

                  <div>
                    <label className={labelClass}>
                      Language
                    </label>

                    <select
                      className={inputClass}
                      value={siteData.language}
                      onChange={(e) =>
                        setSiteData({
                          ...siteData,
                          language: e.target.value,
                        })
                      }
                    >
                      <option>English</option>
                      <option>Urdu</option>
                    </select>
                  </div>

                </div>

                <SaveButton
                  saved={saved}
                  onClick={handleSave}
                />
              </SettingsCard>
            )}
            {activeSection === "email" && (
              <SettingsCard
                title="SMTP Configuration"
                description="Configure the email server used by your application"
              >
                <div className="grid grid-cols-1 gap-5 md:grid-cols-2">

                  <div>
                    <label className={labelClass}>
                      SMTP Host
                    </label>

                    <input
                      className={inputClass}
                      value={emailData.smtpHost}
                      onChange={(e) =>
                        setEmailData({
                          ...emailData,
                          smtpHost: e.target.value,
                        })
                      }
                    />
                  </div>

                  <div>
                    <label className={labelClass}>
                      SMTP Port
                    </label>

                    <input
                      className={inputClass}
                      value={emailData.smtpPort}
                      onChange={(e) =>
                        setEmailData({
                          ...emailData,
                          smtpPort: e.target.value,
                        })
                      }
                    />
                  </div>

                  <div>
                    <label className={labelClass}>
                      Username
                    </label>

                    <input
                      className={inputClass}
                      value={emailData.username}
                      onChange={(e) =>
                        setEmailData({
                          ...emailData,
                          username: e.target.value,
                        })
                      }
                    />
                  </div>

                  <div>
                    <label className={labelClass}>
                      Password
                    </label>

                    <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        className={`${inputClass} pr-12`}
                        placeholder="Enter password"
                        value={emailData.password}
                        onChange={(e) =>
                          setEmailData({
                            ...emailData,
                            password: e.target.value,
                          })
                        }
                      />

                      <button
                        type="button"
                        onClick={() =>
                          setShowPassword(!showPassword)
                        }
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                      >
                        {showPassword ? (
                          <EyeOff size={18} />
                        ) : (
                          <Eye size={18} />
                        )}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className={labelClass}>
                      Sender Name
                    </label>

                    <input
                      className={inputClass}
                      value={emailData.senderName}
                      onChange={(e) =>
                        setEmailData({
                          ...emailData,
                          senderName: e.target.value,
                        })
                      }
                    />
                  </div>

                  <div>
                    <label className={labelClass}>
                      Sender Email
                    </label>

                    <input
                      className={inputClass}
                      value={emailData.senderEmail}
                      onChange={(e) =>
                        setEmailData({
                          ...emailData,
                          senderEmail: e.target.value,
                        })
                      }
                    />
                  </div>

                </div>

                <div className="mt-6 flex flex-wrap gap-3">

                  <button
                    onClick={handleSave}
                    className="flex items-center gap-2 rounded-lg bg-red-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-red-700"
                  >
                    <Save size={17} />
                    Save Settings
                  </button>

                  <button
                    onClick={() =>
                      alert("Test email sent successfully!")
                    }
                    className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                  >
                    <Mail size={17} />
                    Send Test Email
                  </button>

                </div>
              </SettingsCard>
            )}

            {activeSection === "notifications" && (
              <SettingsCard
                title="Notification Preferences"
                description="Choose which notifications you want to receive"
              >

                <div className="divide-y divide-slate-100">

                  <ToggleRow
                    icon={<Database size={18} />}
                    title="New Donor Registration"
                    description="Get notified when a new donor registers"
                    enabled={notificationData.newDonor}
                    onChange={() =>
                      setNotificationData({
                        ...notificationData,
                        newDonor: !notificationData.newDonor,
                      })
                    }
                  />

                  <ToggleRow
                    icon={<AlertTriangle size={18} />}
                    title="Blood Request"
                    description="Receive alerts for new blood requests"
                    enabled={notificationData.bloodRequest}
                    onChange={() =>
                      setNotificationData({
                        ...notificationData,
                        bloodRequest: !notificationData.bloodRequest,
                      })
                    }
                  />

                  <ToggleRow
                    icon={<Clock size={18} />}
                    title="Donation Reminder"
                    description="Send reminders to eligible donors"
                    enabled={notificationData.donationReminder}
                    onChange={() =>
                      setNotificationData({
                        ...notificationData,
                        donationReminder:
                          !notificationData.donationReminder,
                      })
                    }
                  />

                  <ToggleRow
                    icon={<Mail size={18} />}
                    title="Email Notifications"
                    description="Receive notifications through email"
                    enabled={notificationData.emailNotification}
                    onChange={() =>
                      setNotificationData({
                        ...notificationData,
                        emailNotification:
                          !notificationData.emailNotification,
                      })
                    }
                  />

                  <ToggleRow
                    icon={<Smartphone size={18} />}
                    title="SMS Notifications"
                    description="Receive important alerts through SMS"
                    enabled={notificationData.smsNotification}
                    onChange={() =>
                      setNotificationData({
                        ...notificationData,
                        smsNotification:
                          !notificationData.smsNotification,
                      })
                    }
                  />

                  <ToggleRow
                    icon={<Bell size={18} />}
                    title="Admin Alerts"
                    description="Receive important administrator alerts"
                    enabled={notificationData.adminAlert}
                    onChange={() =>
                      setNotificationData({
                        ...notificationData,
                        adminAlert: !notificationData.adminAlert,
                      })
                    }
                  />

                </div>

                <SaveButton
                  saved={saved}
                  onClick={handleSave}
                />

              </SettingsCard>
            )}

           

            {activeSection === "security" && (
              <div className="space-y-6">

                <SettingsCard
                  title="Security Settings"
                  description="Protect your administrator account"
                >

                  <ToggleRow
                    icon={<Shield size={18} />}
                    title="Two-Factor Authentication"
                    description="Add an extra layer of security to your account"
                    enabled={securityData.twoFactor}
                    onChange={() =>
                      setSecurityData({
                        ...securityData,
                        twoFactor: !securityData.twoFactor,
                      })
                    }
                  />

                  <ToggleRow
                    icon={<Bell size={18} />}
                    title="Login Alerts"
                    description="Get notified whenever your account is accessed"
                    enabled={securityData.loginAlert}
                    onChange={() =>
                      setSecurityData({
                        ...securityData,
                        loginAlert: !securityData.loginAlert,
                      })
                    }
                  />

                  <div className="mt-6">
                    <label className={labelClass}>
                      Session Timeout
                    </label>

                    <select
                      className="w-full max-w-sm rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-red-400"
                      value={securityData.sessionTimeout}
                      onChange={(e) =>
                        setSecurityData({
                          ...securityData,
                          sessionTimeout: e.target.value,
                        })
                      }
                    >
                      <option value="15">15 Minutes</option>
                      <option value="30">30 Minutes</option>
                      <option value="60">1 Hour</option>
                      <option value="120">2 Hours</option>
                    </select>
                  </div>

                  <SaveButton
                    saved={saved}
                    onClick={handleSave}
                  />

                </SettingsCard>

                <SettingsCard
                  title="Change Password"
                  description="Update your administrator password"
                >

                  <div className="max-w-xl space-y-5">

                    <div>
                      <label className={labelClass}>
                        Current Password
                      </label>

                      <input
                        type="password"
                        className={inputClass}
                        placeholder="Enter current password"
                      />
                    </div>

                    <div>
                      <label className={labelClass}>
                        New Password
                      </label>

                      <input
                        type="password"
                        className={inputClass}
                        placeholder="Enter new password"
                      />
                    </div>

                    <div>
                      <label className={labelClass}>
                        Confirm Password
                      </label>

                      <input
                        type="password"
                        className={inputClass}
                        placeholder="Confirm new password"
                      />
                    </div>

                  </div>

                  <button
                    onClick={() =>
                      alert("Password updated successfully!")
                    }
                    className="mt-6 flex items-center gap-2 rounded-lg bg-red-600 px-5 py-3 text-sm font-semibold text-white hover:bg-red-700"
                  >
                    <Lock size={17} />
                    Update Password
                  </button>

                </SettingsCard>

              </div>
            )}

            {activeSection === "backup" && (
              <div className="space-y-6">

                <SettingsCard
                  title="Database Backup"
                  description="Create and manage backups of your application data"
                >

                  <div className="rounded-xl border border-slate-200 bg-slate-50 p-5">

                    <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center">

                      <div className="flex items-center gap-4">

                        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-red-100 text-red-600">
                          <Database size={22} />
                        </div>

                        <div>
                          <h3 className="font-semibold text-slate-800">
                            Create New Backup
                          </h3>

                          <p className="mt-1 text-sm text-slate-500">
                            Backup all donors, blood requests and events
                          </p>
                        </div>

                      </div>

                      <button
                        onClick={() =>
                          alert("Backup created successfully!")
                        }
                        className="flex items-center justify-center gap-2 rounded-lg bg-red-600 px-5 py-3 text-sm font-semibold text-white hover:bg-red-700"
                      >
                        <RefreshCw size={17} />
                        Create Backup
                      </button>

                    </div>

                  </div>

                </SettingsCard>

                <SettingsCard
                  title="Recent Backups"
                  description="Download or manage your previous backups"
                >

                  <div className="overflow-x-auto">

                    <table className="w-full min-w-[600px]">

                      <thead>
                        <tr className="border-b border-slate-200 text-left">
                          <th className="px-4 py-3 text-xs font-semibold uppercase text-slate-500">
                            Backup
                          </th>

                          <th className="px-4 py-3 text-xs font-semibold uppercase text-slate-500">
                            Date
                          </th>

                          <th className="px-4 py-3 text-xs font-semibold uppercase text-slate-500">
                            Size
                          </th>

                          <th className="px-4 py-3 text-xs font-semibold uppercase text-slate-500">
                            Action
                          </th>
                        </tr>
                      </thead>

                      <tbody>

                        <BackupRow
                          name="backup-september-17.sql"
                          date="Sep 17, 2026"
                          size="4.8 MB"
                        />

                        <BackupRow
                          name="backup-september-10.sql"
                          date="Sep 10, 2026"
                          size="4.5 MB"
                        />

                        <BackupRow
                          name="backup-september-03.sql"
                          date="Sep 03, 2026"
                          size="4.2 MB"
                        />

                      </tbody>

                    </table>

                  </div>

                </SettingsCard>

              </div>
            )}

          </main>
        </div>
      </div>
    </div>
  );
}



function SettingsCard({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: ReactNode;
}) {
  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">

      <div className="border-b border-slate-100 px-6 py-5">
        <h3 className="font-semibold text-slate-800">
          {title}
        </h3>

        <p className="mt-1 text-sm text-slate-500">
          {description}
        </p>
      </div>

      <div className="p-6">
        {children}
      </div>

    </div>
  );
}



function SaveButton({
  saved,
  onClick,
}: {
  saved: boolean;
  onClick: () => void;
}) {
  return (
    <div className="mt-7 flex justify-end">

      <button
        onClick={onClick}
        className="flex items-center gap-2 rounded-lg bg-red-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-red-700"
      >
        {saved ? (
          <>
            <CheckCircle size={17} />
            Saved Successfully
          </>
        ) : (
          <>
            <Save size={17} />
            Save Changes
          </>
        )}
      </button>

    </div>
  );
}


function ToggleRow({
  icon,
  title,
  description,
  enabled,
  onChange,
}: {
  icon: ReactNode;
  title: string;
  description: string;
  enabled: boolean;
  onChange: () => void;
}) {
  return (
    <div className="flex items-center justify-between gap-5 py-5">

      <div className="flex items-start gap-4">

        <div className="mt-1 text-slate-500">
          {icon}
        </div>

        <div>
          <h4 className="text-sm font-semibold text-slate-800">
            {title}
          </h4>

          <p className="mt-1 text-sm text-slate-500">
            {description}
          </p>
        </div>

      </div>

      <Toggle
        enabled={enabled}
        onClick={onChange}
      />

    </div>
  );
}



function Toggle({
  enabled,
  onClick,
}: {
  enabled: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`relative h-6 w-11 flex-shrink-0 rounded-full transition ${
        enabled ? "bg-red-600" : "bg-slate-300"
      }`}
    >
      <span
        className={`absolute top-1 h-4 w-4 rounded-full bg-white shadow transition ${
          enabled ? "left-6" : "left-1"
        }`}
      />
    </button>
  );
}



function BackupRow({
  name,
  date,
  size,
}: {
  name: string;
  date: string;
  size: string;
}) {
  return (
    <tr className="border-b border-slate-100">

      <td className="px-4 py-4">

        <div className="flex items-center gap-3">

          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-100 text-slate-500">
            <FileText size={17} />
          </div>

          <span className="text-sm font-medium text-slate-700">
            {name}
          </span>

        </div>

      </td>

      <td className="px-4 py-4 text-sm text-slate-500">
        {date}
      </td>

      <td className="px-4 py-4 text-sm text-slate-500">
        {size}
      </td>

      <td className="px-4 py-4">

        <button
          onClick={() => alert(`Downloading ${name}`)}
          className="flex items-center gap-2 text-sm font-medium text-red-600 hover:text-red-700"
        >
          <Download size={16} />
          Download
        </button>

      </td>

    </tr>
  );
}