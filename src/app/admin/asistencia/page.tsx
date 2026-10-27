"use client";

import { useState, useRef, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { ZONA_HORARIA } from "@/lib/fecha";
import { fotoSrc } from "@/lib/fotos";
import {
  Clock,
  Camera,
  MessageSquare,
  Table as TableIcon,
  CheckCircle2,
  AlertCircle,
  Calendar,
  Filter,
  UserCheck,
  RefreshCw,
  Video,
  VideoOff,
  Image as ImageIcon,
} from "lucide-react";

interface EmployeeMock {
  id: string;
  name: string;
  position: string;
  lastStatus: "entrada" | "salida" | "ninguno";
  lastTime?: string;
}

interface AttendanceRecordMock {
  id: string;
  employeeId: string;
  employeeName: string;
  type: "entrada" | "salida";
  method: "manual" | "camara" | "whatsapp";
  timestamp: string;
  date: string;
  time: string;
  photoUrl?: string;
  status: "valido" | "rechazado";
}

export default function AsistenciaPage() {
  const [activeTab, setActiveTab] = useState<"marcar" | "tabla">("marcar");
  const [method, setMethod] = useState<"manual" | "camara" | "whatsapp">("manual");
  const [employees, setEmployees] = useState<EmployeeMock[]>([]);
  const [records, setRecords] = useState<AttendanceRecordMock[]>([]);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [feedback, setFeedback] = useState<{ message: string; type: "success" | "error" } | null>(null);

  // Estados para cámara de laptop
  const [cameraActive, setCameraActive] = useState(false);
  const [capturedPhoto, setCapturedPhoto] = useState<string | null>(null);
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<string>("");
  const videoRef = useRef<HTMLVideoElement>(null);
  const loadEmployees = async () => {
    const res = await fetch("/api/employees", { cache: "no-store" });
    const json = await res.json();
    if (!res.ok) return;
    const mapped: EmployeeMock[] = (json.data ?? []).map((e: any) => ({
      id: e.id,
      name: e.full_name,
      position: e.position,
      lastStatus: "salida",
    }));
    setEmployees(mapped);
    if (mapped.length && !selectedEmployeeId) setSelectedEmployeeId(mapped[0].id);
  };

  const loadRecords = async () => {
    const res = await fetch("/api/attendance", { cache: "no-store" });
    const json = await res.json();
    if (!res.ok) return;
    const mapped: AttendanceRecordMock[] = (json.data ?? []).map((r: any) => {
      const d = new Date(r.timestamp);
      return {
        id: r.id,
        employeeId: r.employee_id,
        employeeName: r.employees?.full_name ?? "Empleado",
        type: r.record_type,
        method: r.method,
        timestamp: r.timestamp,
        date: d.toLocaleDateString("es-EC", { timeZone: ZONA_HORARIA, year: "numeric", month: "2-digit", day: "2-digit" }),
        time: d.toLocaleTimeString("es-EC", { timeZone: ZONA_HORARIA, hour: "2-digit", minute: "2-digit", second: "2-digit" }),
        photoUrl: r.photo_url,
        status: r.status,
      };
    });
    setRecords(mapped);

    // Estado real de cada empleado según su última marcación válida
    // (los registros llegan del más reciente al más antiguo).
    setEmployees((prev) =>
      prev.map((emp) => {
        const ultima = mapped.find((r) => r.employeeId === emp.id && r.status === "valido");
        return ultima ? { ...emp, lastStatus: ultima.type, lastTime: ultima.time } : emp;
      })
    );
  };

  useEffect(() => {
    (async () => {
      setIsLoadingData(true);
      await loadEmployees();
      await loadRecords();
      setIsLoadingData(false);
    })();
  }, []);


  // Iniciar o detener cámara
  const startCamera = async () => {
    try {
      setCapturedPhoto(null);
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: 640, height: 480, facingMode: "user" },
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
        setCameraActive(true);
      }
    } catch (err) {
      console.error("Error al acceder a la cámara:", err);
      setFeedback({
        message: "No se pudo acceder a la cámara web. Asegúrese de conceder los permisos del navegador.",
        type: "error",
      });
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach((track) => track.stop());
      videoRef.current.srcObject = null;
      setCameraActive(false);
    }
  };

  // Capturar foto desde la cámara
  const takeSnapshot = () => {
    if (!videoRef.current) return;
    const canvas = document.createElement("canvas");
    canvas.width = videoRef.current.videoWidth || 640;
    canvas.height = videoRef.current.videoHeight || 480;
    const ctx = canvas.getContext("2d");
    if (ctx) {
      ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
      const dataUrl = canvas.toDataURL("image/jpeg", 0.85);
      setCapturedPhoto(dataUrl);
      stopCamera();
    }
  };

  // Limpiar stream al desmontar
  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  // Registrar marcacion
  const handleRegister = async (
    employeeId: string,
    type: "entrada" | "salida",
    regMethod: "manual" | "camara" | "whatsapp",
    photo?: string
  ) => {
    const employee = employees.find((e) => e.id === employeeId);
    if (!employee) return;

    // Si la foto viene en base64 (cámara), subirla a Supabase Storage primero
    // y guardar solo la URL pública para no inflar la base de datos.
    let photoUrl: string | null = photo || null;
    if (photo && photo.startsWith("data:")) {
      try {
        const supabase = createClient();
        const blobRes = await fetch(photo);
        const blob = await blobRes.blob();
        const ext = photo.includes("image/png") ? "png" : "jpg";
        const path = `attendance/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from("attendance-photos")
          .upload(path, blob, { contentType: blob.type || "image/jpeg", upsert: false });
        if (uploadError) throw uploadError;
        // Se guarda solo la ruta: el bucket es privado y la foto se ve
        // a través de /api/attendance/foto (solo admins, link temporal).
        photoUrl = uploadData.path;
      } catch (err) {
        console.error("Error subiendo foto a Storage:", err);
        setFeedback({
          message: "No se pudo subir la foto a Storage. Verifica el bucket 'attendance-photos' y sus políticas. Marcación cancelada.",
          type: "error",
        });
        setTimeout(() => setFeedback(null), 4500);
        return;
      }
    }

    try {
      const res = await fetch("/api/attendance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          employee_id: employeeId,
          record_type: type,
          method: regMethod,
          photo_url: photoUrl,
        }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json?.error || "No se pudo guardar la marcación");

      const r = json.data;
      const d = new Date(r.timestamp);
      const newRecord: AttendanceRecordMock = {
        id: r.id,
        employeeId,
        employeeName: employee.name,
        type,
        method: regMethod,
        timestamp: r.timestamp,
        date: d.toLocaleDateString("es-EC", { timeZone: ZONA_HORARIA, year: "numeric", month: "2-digit", day: "2-digit" }),
        time: d.toLocaleTimeString("es-EC", { timeZone: ZONA_HORARIA, hour: "2-digit", minute: "2-digit", second: "2-digit" }),
        photoUrl: photoUrl ?? undefined,
        status: "valido",
      };

      setRecords((prev) => [newRecord, ...prev]);
      setEmployees((prev) =>
        prev.map((emp) =>
          emp.id === employeeId ? { ...emp, lastStatus: type, lastTime: newRecord.time } : emp
        )
      );

      setFeedback({
        message: `Marcación registrada con éxito: ${employee.name} (${type.toUpperCase()} a las ${newRecord.time}).`,
        type: "success",
      });
      setCapturedPhoto(null);
      setTimeout(() => setFeedback(null), 4500);
    } catch (err) {
      setFeedback({
        message: err instanceof Error ? err.message : "Error al guardar la marcación",
        type: "error",
      });
      setTimeout(() => setFeedback(null), 4500);
    }
  };

  return (
    <div className="space-y-6">
      {/* Encabezado */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-brand-latte-border">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-brand-espresso">
            Control de Asistencia
          </h1>
          <p className="text-xs sm:text-sm text-brand-espresso/70 mt-0.5">
            Registro de entradas y salidas del personal operativo de Ricuras de Sal y Dulce.
          </p>
        </div>

        {/* Pestañas principales */}
        <div className="inline-flex p-1 rounded-xl bg-white border border-brand-latte-border shadow-sm">
          <button
            onClick={() => setActiveTab("marcar")}
            type="button"
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
              activeTab === "marcar"
                ? "bg-brand-espresso text-white shadow-sm"
                : "text-brand-espresso/70 hover:text-brand-espresso"
            }`}
          >
            <Clock className="w-3.5 h-3.5 text-brand-amber" />
            <span>Terminal de Marcación</span>
          </button>

          <button
            onClick={() => setActiveTab("tabla")}
            type="button"
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
              activeTab === "tabla"
                ? "bg-brand-espresso text-white shadow-sm"
                : "text-brand-espresso/70 hover:text-brand-espresso"
            }`}
          >
            <TableIcon className="w-3.5 h-3.5 text-brand-terracotta" />
            <span>Historial de Marcaciones</span>
          </button>
        </div>
      </div>

      {/* Alerta de confirmacion o error */}
      {feedback && (
        <div
          className={`p-4 rounded-xl border flex items-start gap-3 text-xs ${
            feedback.type === "success"
              ? "bg-green-50 border-green-200 text-green-800"
              : "bg-red-50 border-red-200 text-red-800"
          }`}
        >
          {feedback.type === "success" ? (
            <CheckCircle2 className="w-4 h-4 text-green-600 shrink-0 mt-0.5" />
          ) : (
            <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
          )}
          <span className="font-medium">{feedback.message}</span>
        </div>
      )}

      {/* PESTAÑA 1: TERMINAL DE MARCACION */}
      {activeTab === "marcar" && (
        <div className="space-y-6">
          {/* Subselector de metodos */}
          <div className="flex flex-wrap gap-2 p-1.5 bg-brand-latte-subtle rounded-xl border border-brand-latte-border">
            <button
              onClick={() => {
                setMethod("manual");
                stopCamera();
              }}
              type="button"
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
                method === "manual"
                  ? "bg-white text-brand-espresso border border-brand-latte-border shadow-sm"
                  : "text-brand-espresso/70 hover:text-brand-espresso"
              }`}
            >
              <UserCheck className="w-4 h-4 text-brand-terracotta" />
              <span>Opción 1: Marcación Manual por Administrador</span>
            </button>

            <button
              onClick={() => setMethod("camara")}
              type="button"
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
                method === "camara"
                  ? "bg-white text-brand-espresso border border-brand-latte-border shadow-sm"
                  : "text-brand-espresso/70 hover:text-brand-espresso"
              }`}
            >
              <Camera className="w-4 h-4 text-brand-botanical" />
              <span>Opción 2: Cámara Integrada de Laptop</span>
            </button>

            <button
              onClick={() => {
                setMethod("whatsapp");
                stopCamera();
              }}
              type="button"
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
                method === "whatsapp"
                  ? "bg-white text-brand-espresso border border-brand-latte-border shadow-sm"
                  : "text-brand-espresso/70 hover:text-brand-espresso"
              }`}
            >
              <MessageSquare className="w-4 h-4 text-brand-amber" />
              <span>Opción 3: Bot Oficial de WhatsApp</span>
            </button>
          </div>

          {/* METODO 1: MANUAL CON BOTONES POR TRABAJADOR */}
          {method === "manual" && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-white border border-brand-latte-border flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                <p className="text-brand-espresso/80">
                  Seleccione directamente la acción para el colaborador. Cada marcación registra fecha, hora y el usuario administrador en turno.
                </p>
                <span className="font-semibold text-brand-espresso shrink-0">
                  {employees.length} colaboradores habilitados
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {employees.map((emp) => {
                  const isInShift = emp.lastStatus === "entrada";
                  return (
                    <div
                      key={emp.id}
                      className="p-5 rounded-2xl bg-white border border-brand-latte-border shadow-sm flex flex-col justify-between space-y-4"
                    >
                      <div>
                        <div className="flex items-start justify-between gap-2">
                          <h3 className="font-serif font-bold text-base text-brand-espresso">
                            {emp.name}
                          </h3>
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                              isInShift
                                ? "bg-green-50 text-green-700 border border-green-200"
                                : "bg-brand-latte text-brand-espresso/60 border border-brand-latte-border"
                            }`}
                          >
                            {isInShift ? "En Turno" : "Fuera"}
                          </span>
                        </div>
                        <p className="text-xs text-brand-espresso/60 mt-1">
                          {emp.position}
                        </p>
                        {emp.lastTime && (
                          <p className="text-[11px] text-brand-espresso/50 mt-2">
                            Última acción: {emp.lastStatus.toUpperCase()} a las {emp.lastTime}
                          </p>
                        )}
                      </div>

                      <div className="grid grid-cols-2 gap-2 pt-2 border-t border-brand-latte-border">
                        <button
                          onClick={() => handleRegister(emp.id, "entrada", "manual")}
                          type="button"
                          disabled={isInShift}
                          className="py-2.5 px-3 rounded-lg text-xs font-semibold text-white bg-brand-botanical hover:bg-brand-botanical-hover disabled:opacity-30 disabled:cursor-not-allowed transition-all shadow-sm"
                        >
                          Marcar Entrada
                        </button>
                        <button
                          onClick={() => handleRegister(emp.id, "salida", "manual")}
                          type="button"
                          disabled={!isInShift}
                          className="py-2.5 px-3 rounded-lg text-xs font-semibold text-white bg-brand-espresso hover:bg-brand-espresso-light disabled:opacity-30 disabled:cursor-not-allowed transition-all shadow-sm"
                        >
                          Marcar Salida
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* METODO 2: CAMARA DE LAPTOP */}
          {method === "camara" && (
            <div className="p-6 rounded-3xl bg-white border border-brand-latte-border shadow-sm space-y-6 max-w-2xl mx-auto">
              <div>
                <h3 className="font-serif font-bold text-lg text-brand-espresso">
                  Marcación con Verificación Fotográfica
                </h3>
                <p className="text-xs text-brand-espresso/70 mt-1">
                  El colaborador se posiciona frente a la laptop del establecimiento para capturar su fotografía como comprobante de presencia física.
                </p>
              </div>

              {/* Selector de colaborador */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-brand-espresso mb-2">
                  Seleccionar Colaborador
                </label>
                <select
                  value={selectedEmployeeId}
                  onChange={(e) => setSelectedEmployeeId(e.target.value)}
                  className="w-full p-2.5 rounded-lg border border-brand-latte-border text-sm text-brand-espresso bg-brand-latte/30 focus:outline-none focus:ring-2 focus:ring-brand-terracotta"
                >
                  {employees.map((e) => (
                    <option key={e.id} value={e.id}>
                      {e.name} — {e.position}
                    </option>
                  ))}
                </select>
              </div>

              {/* Visor de camara o foto capturada */}
              <div className="relative rounded-2xl overflow-hidden border border-brand-latte-border bg-black aspect-video flex items-center justify-center">
                {capturedPhoto ? (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img
                    src={capturedPhoto}
                    alt="Foto capturada para marcación"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <video
                    ref={videoRef}
                    playsInline
                    muted
                    className={`w-full h-full object-cover ${cameraActive ? "block" : "hidden"}`}
                  />
                )}

                {!cameraActive && !capturedPhoto && (
                  <div className="text-center p-6 space-y-2 text-white/70">
                    <VideoOff className="w-8 h-8 mx-auto text-white/40" />
                    <p className="text-xs">La cámara se encuentra apagada.</p>
                  </div>
                )}
              </div>

              {/* Controles de camara */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                {!cameraActive && !capturedPhoto && (
                  <button
                    onClick={startCamera}
                    type="button"
                    className="btn-secondary text-xs flex items-center gap-2 py-2.5 px-4"
                  >
                    <Video className="w-4 h-4 text-brand-botanical" />
                    <span>Activar Cámara Web</span>
                  </button>
                )}

                {cameraActive && (
                  <>
                    <button
                      onClick={takeSnapshot}
                      type="button"
                      className="btn-primary text-xs flex items-center gap-2 py-2.5 px-5"
                    >
                      <Camera className="w-4 h-4" />
                      <span>Tomar Fotografía</span>
                    </button>
                    <button
                      onClick={stopCamera}
                      type="button"
                      className="btn-secondary text-xs flex items-center gap-2 py-2.5 px-4"
                    >
                      <VideoOff className="w-4 h-4 text-red-600" />
                      <span>Cancelar</span>
                    </button>
                  </>
                )}

                {capturedPhoto && (
                  <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
                    <button
                      onClick={() =>
                        handleRegister(selectedEmployeeId, "entrada", "camara", capturedPhoto)
                      }
                      type="button"
                      className="py-2.5 px-4 rounded-lg text-xs font-semibold text-white bg-brand-botanical hover:bg-brand-botanical-hover shadow-sm"
                    >
                      Confirmar Entrada con Foto
                    </button>
                    <button
                      onClick={() =>
                        handleRegister(selectedEmployeeId, "salida", "camara", capturedPhoto)
                      }
                      type="button"
                      className="py-2.5 px-4 rounded-lg text-xs font-semibold text-white bg-brand-espresso hover:bg-brand-espresso-light shadow-sm"
                    >
                      Confirmar Salida con Foto
                    </button>
                    <button
                      onClick={() => {
                        setCapturedPhoto(null);
                        startCamera();
                      }}
                      type="button"
                      className="btn-secondary text-xs py-2.5 px-3 flex items-center gap-1.5"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                      <span>Repetir Foto</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* METODO 3: BOT DE WHATSAPP */}
          {method === "whatsapp" && (
            <div className="p-8 rounded-3xl bg-white border border-brand-latte-border shadow-sm space-y-4 max-w-2xl mx-auto">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-brand-amber/15 text-brand-espresso border border-brand-amber/30">
                Fase de Integración Meta Cloud API
              </div>

              <h3 className="font-serif font-bold text-xl text-brand-espresso">
                Marcación Remota con Validación de Geocerca
              </h3>

              <p className="text-xs sm:text-sm text-brand-espresso/80 leading-relaxed">
                Este canal permite a los colaboradores enviar la palabra <strong>&quot;entrada&quot;</strong> o <strong>&quot;salida&quot;</strong> al número corporativo de WhatsApp. El sistema responde solicitando su fotografía selfie y ubicación GPS en tiempo real para verificar mediante la fórmula de Haversine que se encuentren dentro del perímetro del restaurante (San Sebastián o Pádel Club).
              </p>

              <div className="p-4 rounded-2xl bg-brand-latte border border-brand-latte-border space-y-2 text-xs">
                <p className="font-semibold text-brand-espresso">Estado del Webhook:</p>
                <p className="text-brand-espresso/70">
                  Endpoint preparado en <code>/api/webhook/whatsapp</code>. Listo para conectarse al crear la aplicación en Meta for Developers.
                </p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* PESTAÑA 2: TABLA DE HISTORIAL CON FILTROS */}
      {activeTab === "tabla" && (
        <div className="p-6 rounded-3xl bg-white border border-brand-latte-border shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="font-serif font-bold text-xl text-brand-espresso">
                Historial Detallado de Marcaciones
              </h3>
              <p className="text-xs text-brand-espresso/60 mt-0.5">
                Consulte y audite las entradas y salidas registradas con fecha, hora, método y comprobantes.
              </p>
            </div>

            <div className="flex items-center gap-2 text-xs text-brand-espresso/70">
              <Filter className="w-4 h-4 text-brand-terracotta" />
              <span>{records.length} registros en total</span>
            </div>
          </div>

          {records.length === 0 ? (
            <div className="p-12 text-center border border-dashed border-brand-latte-border rounded-2xl space-y-3">
              <Clock className="w-8 h-8 mx-auto text-brand-espresso/30" />
              <p className="font-serif font-bold text-base text-brand-espresso">
                Sin registros en esta sesión
              </p>
              <p className="text-xs text-brand-espresso/60 max-w-sm mx-auto">
                Realice una marcación manual o con cámara desde la pestaña anterior para visualizarla aquí.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-brand-latte-border bg-brand-latte/40 text-brand-espresso/70 uppercase tracking-wider font-semibold text-[11px]">
                    <th className="py-3 px-4">Colaborador</th>
                    <th className="py-3 px-4">Acción</th>
                    <th className="py-3 px-4">Método</th>
                    <th className="py-3 px-4">Fecha</th>
                    <th className="py-3 px-4">Hora</th>
                    <th className="py-3 px-4">Evidencia</th>
                    <th className="py-3 px-4">Estado</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-brand-latte-border">
                  {records.map((rec) => (
                    <tr key={rec.id} className="hover:bg-brand-latte/20 transition-colors">
                      <td className="py-3.5 px-4 font-semibold text-brand-espresso">
                        {rec.employeeName}
                      </td>
                      <td className="py-3.5 px-4">
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                            rec.type === "entrada"
                              ? "bg-green-50 text-green-700 border border-green-200"
                              : "bg-orange-50 text-orange-700 border border-orange-200"
                          }`}
                        >
                          {rec.type}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 capitalize text-brand-espresso/70">
                        {rec.method}
                      </td>
                      <td className="py-3.5 px-4 text-brand-espresso/70">{rec.date}</td>
                      <td className="py-3.5 px-4 font-mono text-brand-espresso">{rec.time}</td>
                      <td className="py-3.5 px-4">
                        {rec.photoUrl ? (
                          <div className="w-8 h-8 rounded-lg overflow-hidden border border-brand-latte-border bg-black">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={fotoSrc(rec.photoUrl)}
                              alt="Comprobante"
                              className="w-full h-full object-cover"
                            />
                          </div>
                        ) : (
                          <span className="text-brand-espresso/40 italic">N/A</span>
                        )}
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="inline-flex items-center gap-1 text-green-700 font-semibold text-[11px]">
                          <CheckCircle2 className="w-3.5 h-3.5 text-green-600" />
                          Válido
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
