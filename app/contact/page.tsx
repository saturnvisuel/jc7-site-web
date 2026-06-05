"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/navbar";
import { MapPin, Phone, Mail, Clock, Facebook, Instagram, ChevronDown } from "lucide-react";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    prenom: "",
    nom: "",
    email: "",
    telephone: "",
    age: "",
    sujet: "",
    message: "",
    newsletter: false,
    rgpd: false,
  });

  const [showMessage, setShowMessage] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowMessage(true);
    setFormData({
      prenom: "",
      nom: "",
      email: "",
      telephone: "",
      age: "",
      sujet: "",
      message: "",
      newsletter: false,
      rgpd: false,
    });
    setTimeout(() => setShowMessage(false), 5000);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    if (type === "checkbox") {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData((prev) => ({ ...prev, [name]: checked }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const faqs = [
    {
      question: "Comment s'inscrire au JC7 ?",
      answer: "Vous pouvez vous inscrire directement en ligne sur notre site via la page 'S'inscrire'. Vous pouvez également nous contacter par téléphone (06 12 92 61 41) ou email (judo.courneuve93@gmail.com) pour toute question. Un certificat médical de non contre-indication à la pratique du judo de moins de 3 mois sera demandé.",
    },
    {
      question: "Faut-il avoir un judogi (kimono) ?",
      answer: "Pour le premier cours, un jogging suffit. Si vous souhaitez continuer, l'achat d'un judogi blanc sera nécessaire. Nous pouvons vous conseiller sur le choix et la taille adaptés à votre pratique.",
    },
    {
      question: "Quels sont les tarifs d'inscription ?",
      answer: "Nos tarifs sont de 130€/an pour le Baby Judo (4-5 ans) et 180€/an pour toutes les autres catégories (Poussins, Benjamins, Minimes, Cadets, Juniors, Seniors). La licence FFJudo est incluse dans le tarif. Paiement en plusieurs fois possible.",
    },
    {
      question: "À partir de quel âge peut-on pratiquer le judo ?",
      answer: "Nous accueillons les enfants dès 4 ans en baby judo avec notre professeur Moustapha Camara. Le judo développe la coordination, la confiance en soi, le respect des autres et la discipline dans un cadre sécurisé et ludique.",
    },
    {
      question: "Où se trouvent les cours ?",
      answer: "Les cours ont lieu au Gymnase Beatrice Hess, situé au 43 avenue du Général Leclerc, 93120 La Courneuve. Le gymnase est facilement accessible en transports en commun.",
    },
    {
      question: "Quels sont les horaires des cours ?",
      answer: "Lundi : 17h-18h (Benjamins/Minimes débutants). Mardi : 17h-21h (Poussins, Benjamins/Minimes confirmés, Cadets/Juniors/Seniors). Mercredi : 15h-16h (Poussins), 17h30-19h30 (Baby Judo). Jeudi : 17h-18h (Benjamins/Minimes débutants). Vendredi : 17h-21h (Poussins, Benjamins/Minimes confirmés, Cadets/Juniors/Seniors). Samedi : 13h-15h (Préparation physique). Consultez notre page 'Cours & Horaires' pour le planning complet.",
    },
  ];

  return (
    <main className="min-h-screen bg-white">
      <Navbar />

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-red-600 via-red-500 to-red-700 text-white py-16 sm:py-20 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6">
              Contactez-nous
            </h1>
            <p className="text-lg sm:text-xl md:text-2xl text-white/90 max-w-3xl mx-auto px-4">
              Nous sommes à votre écoute pour répondre à toutes vos questions
            </p>
          </div>
        </div>
      </section>

      {/* Contact Form & Info Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div>
              <h2 className="text-3xl font-bold text-gray-800 mb-6">Envoyez-nous un message</h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="prenom" className="block text-sm font-medium text-gray-700 mb-2">
                      Prénom *
                    </label>
                    <input
                      type="text"
                      id="prenom"
                      name="prenom"
                      required
                      value={formData.prenom}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-600 focus:border-transparent transition-colors"
                      placeholder="Votre prénom"
                    />
                  </div>
                  <div>
                    <label htmlFor="nom" className="block text-sm font-medium text-gray-700 mb-2">
                      Nom *
                    </label>
                    <input
                      type="text"
                      id="nom"
                      name="nom"
                      required
                      value={formData.nom}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-600 focus:border-transparent transition-colors"
                      placeholder="Votre nom"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                      Email *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-600 focus:border-transparent transition-colors"
                      placeholder="votre@email.fr"
                    />
                  </div>
                  <div>
                    <label htmlFor="telephone" className="block text-sm font-medium text-gray-700 mb-2">
                      Téléphone
                    </label>
                    <input
                      type="tel"
                      id="telephone"
                      name="telephone"
                      value={formData.telephone}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-600 focus:border-transparent transition-colors"
                      placeholder="06 12 34 56 78"
                    />
                  </div>
                </div>
                <div>
                  <label htmlFor="age" className="block text-sm font-medium text-gray-700 mb-2">
                    Âge du pratiquant
                  </label>
                  <select
                    id="age"
                    name="age"
                    value={formData.age}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-600 focus:border-transparent transition-colors"
                  >
                    <option value="">Sélectionnez une tranche d'âge</option>
                    <option value="4-5">4-5 ans (Baby Judo)</option>
                    <option value="6-7">6-7 ans (Poussins)</option>
                    <option value="8-13">8-13 ans (Benjamins/Minimes)</option>
                    <option value="14-17">14-17 ans (Cadets/Juniors)</option>
                    <option value="18+">18 ans et + (Adultes)</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="sujet" className="block text-sm font-medium text-gray-700 mb-2">
                    Sujet *
                  </label>
                  <select
                    id="sujet"
                    name="sujet"
                    required
                    value={formData.sujet}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-600 focus:border-transparent transition-colors"
                  >
                    <option value="">Choisissez un sujet</option>
                    <option value="information">Demande d'information</option>
                    <option value="inscription">Inscription / Cours d'essai</option>
                    <option value="tarifs">Tarifs et modalités</option>
                    <option value="horaires">Horaires des cours</option>
                    <option value="autre">Autre</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                    Message *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={6}
                    required
                    value={formData.message}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-600 focus:border-transparent transition-colors"
                    placeholder="Décrivez votre demande..."
                  />
                </div>
                <div className="flex items-start">
                  <input
                    type="checkbox"
                    id="newsletter"
                    name="newsletter"
                    checked={formData.newsletter}
                    onChange={handleChange}
                    className="h-4 w-4 text-red-600 focus:ring-red-600 border-gray-300 rounded mt-1"
                  />
                  <label htmlFor="newsletter" className="ml-3 block text-sm text-gray-700">
                    Je souhaite recevoir la newsletter du JC7 et être informé(e) des actualités du club
                  </label>
                </div>
                <div className="flex items-start">
                  <input
                    type="checkbox"
                    id="rgpd"
                    name="rgpd"
                    required
                    checked={formData.rgpd}
                    onChange={handleChange}
                    className="h-4 w-4 text-red-600 focus:ring-red-600 border-gray-300 rounded mt-1"
                  />
                  <label htmlFor="rgpd" className="ml-3 block text-sm text-gray-700">
                    J'accepte que mes données soient utilisées pour répondre à ma demande *
                  </label>
                </div>
                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-red-600 via-red-500 to-red-700 text-white py-6 px-6 rounded-lg font-semibold hover:from-red-700 hover:to-red-800 transition-all shadow-lg"
                >
                  Envoyer le message
                </Button>
              </form>
              {showMessage && (
                <div className="mt-4 p-4 rounded-lg bg-green-100 text-green-700 border border-green-300">
                  ✓ Merci pour votre message ! Nous vous répondrons dans les plus brefs délais.
                </div>
              )}
            </div>

            {/* Contact Information */}
            <div className="space-y-8">
              {/* Quick Contact */}
              <div className="bg-white rounded-lg shadow-lg p-8 border-l-4 border-red-600">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">Informations de contact</h2>
                <div className="space-y-6">
                  <div className="flex items-start">
                    <div className="bg-gradient-to-br from-red-100 to-red-200 w-14 h-14 rounded-full flex items-center justify-center mr-4 flex-shrink-0 shadow-md">
                      <MapPin className="text-red-600 w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-800 mb-1 text-lg">Adresse</h3>
                      <p className="text-gray-600">
                        Gymnase Beatrice Hess
                        <br />
                        43 avenue du général Leclerc
                        <br />
                        93120 La Courneuve
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="bg-gradient-to-br from-blue-100 to-blue-200 w-14 h-14 rounded-full flex items-center justify-center mr-4 flex-shrink-0 shadow-md">
                      <Phone className="text-blue-700 w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-800 mb-1 text-lg">Téléphone</h3>
                      <p className="text-gray-600 font-semibold">06 12 92 61 41</p>
                      <p className="text-sm text-gray-500">Disponible pendant les cours</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="bg-gradient-to-br from-amber-100 to-amber-200 w-14 h-14 rounded-full flex items-center justify-center mr-4 flex-shrink-0 shadow-md">
                      <Mail className="text-amber-700 w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-800 mb-1 text-lg">Email</h3>
                      <p className="text-gray-600 font-semibold">judo.courneuve93@gmail.com</p>
                      <p className="text-sm text-gray-500">Réponse sous 48h</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="bg-gradient-to-br from-slate-600 to-slate-700 w-14 h-14 rounded-full flex items-center justify-center mr-4 flex-shrink-0 shadow-md">
                      <Clock className="text-white w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-800 mb-1 text-lg">Horaires des cours</h3>
                      <p className="text-gray-600">
                        <strong>Lundi:</strong> 17h - 18h
                        <br />
                        <strong>Mardi:</strong> 17h - 21h
                        <br />
                        <strong>Mercredi:</strong> 15h - 19h30
                        <br />
                        <strong>Jeudi:</strong> 17h - 18h
                        <br />
                        <strong>Vendredi:</strong> 17h - 21h
                        <br />
                        <strong>Samedi:</strong> 13h - 15h
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Social Media */}
              <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg shadow-lg p-8">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Suivez-nous</h2>
                <p className="text-gray-600 mb-6">
                  Retrouvez-nous sur les réseaux sociaux pour ne rien manquer de nos actualités, événements et
                  compétitions
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <a
                    href="#"
                    className="flex items-center justify-center bg-blue-600 text-white px-6 py-4 rounded-lg font-semibold hover:bg-blue-700 transition-colors shadow-md"
                  >
                    <Facebook className="w-6 h-6 mr-2" />
                    Facebook
                  </a>
                  <a
                    href="#"
                    className="flex items-center justify-center bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-4 rounded-lg font-semibold hover:from-purple-700 hover:to-pink-700 transition-colors shadow-md"
                  >
                    <Instagram className="w-6 h-6 mr-2" />
                    Instagram
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Google Maps Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">Comment nous trouver</h2>
            <p className="text-lg text-gray-600">Notre dojo est facilement accessible en transports en commun</p>
          </div>
          <div className="bg-white rounded-lg shadow-xl overflow-hidden">
            <div className="h-96 w-full">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2620.8!2d2.3947!3d48.9287!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47e66c0e5e5e5e5e%3A0x5e5e5e5e5e5e5e5e!2s43%20Avenue%20du%20G%C3%A9n%C3%A9ral%20Leclerc%2C%2093120%20La%20Courneuve!5e0!3m2!1sfr!2sfr!4v1234567890"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
            </div>
            <div className="p-6 bg-gradient-to-r from-red-600 via-red-500 to-red-700 text-white">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <MapPin className="w-8 h-8 mx-auto mb-2" />
                  <h3 className="font-semibold mb-1">Adresse</h3>
                  <p className="text-sm opacity-90">43 Avenue du Général Leclerc</p>
                  <p className="text-sm opacity-90">93120 La Courneuve</p>
                </div>
                <div className="text-center">
                  <Phone className="w-8 h-8 mx-auto mb-2" />
                  <h3 className="font-semibold mb-1">Téléphone</h3>
                  <p className="text-sm opacity-90">06 12 92 61 41</p>
                </div>
                <div className="text-center">
                  <Mail className="w-8 h-8 mx-auto mb-2" />
                  <h3 className="font-semibold mb-1">Email</h3>
                  <p className="text-sm opacity-90">judo.courneuve93@gmail.com</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">Questions fréquentes</h2>
            <p className="text-lg text-gray-600">Les réponses à vos questions les plus courantes</p>
          </div>
          <div className="max-w-3xl mx-auto space-y-4">
            {faqs.map((faq, index) => (
              <div key={index} className="border border-gray-200 rounded-lg overflow-hidden bg-white">
                <button
                  onClick={() => setOpenFaq(openFaq === index ? null : index)}
                  className="w-full px-6 py-4 text-left flex justify-between items-center hover:bg-gray-50 focus:outline-none focus:bg-gray-50 transition-colors"
                >
                  <span className="font-semibold text-gray-800">{faq.question}</span>
                  <ChevronDown
                    className={`text-gray-500 transition-transform ${openFaq === index ? "rotate-180" : ""}`}
                  />
                </button>
                {openFaq === index && <div className="px-6 pb-4 text-gray-600">{faq.answer}</div>}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-red-600 via-red-500 to-red-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Prêt à commencer le judo ?</h2>
          <p className="text-xl mb-8 opacity-90">Réservez dès maintenant votre cours d'essai gratuit</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="tel:0612926141"
              className="bg-white text-red-600 px-8 py-3 rounded-lg font-semibold hover:bg-red-50 transition-colors shadow-lg inline-flex items-center justify-center"
            >
              <Phone className="w-5 h-5 mr-2" />
              06 12 92 61 41
            </a>
            <Link
              href="/cours"
              className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-red-600 transition-colors shadow-lg inline-flex items-center justify-center"
            >
              Voir les horaires
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
