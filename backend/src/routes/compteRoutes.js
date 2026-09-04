const express = require('express');

function compteRoutes(db) {
  const router = express.Router();
  const compteService = require('../services/compteService');

  // ==========================================
  // ROUTES ADMIN / AUTHENTIFICATION
  // ==========================================
  router.post('/admin/inscription', (req, res) => {
    const { nom, email, motDePasse, role = 'Administrateur' } = req.body;

    if (!nom || !email || !motDePasse) {
      return res.status(400).json({ erreur: "Tous les champs obligatoires doivent être remplis." });
    }

    const emailPropre = email.trim();

    compteService.trouverAdminParEmail(db, emailPropre, (err, results) => {
      if (err) {
        console.error("Erreur SQL vérification email :", err);
        return res.status(500).json({ erreur: "Erreur serveur lors de la vérification de l'email." });
      }

      if (results.length > 0) {
        return res.status(400).json({ erreur: "Cet email est déjà utilisé par un autre administrateur." });
      }

      compteService.insererAdmin(db, nom.trim(), emailPropre, motDePasse, role, (errInsert, resultat) => {
        if (errInsert) {
          console.error("Erreur lors de l'inscription admin :", errInsert);
          return res.status(500).json({ erreur: "Erreur lors de la création du compte administrateur." });
        }

        res.status(201).json({
          message: "Compte administrateur créé avec succès.",
          admin: {
            id: resultat.insertId,
            nom: nom.trim(),
            email: emailPropre,
            role
          }
        });
      });
    });
  });

  router.post('/admin/connexion', (req, res) => {
    const { email, motDePasse, role } = req.body;

    if (!email || !motDePasse) {
      return res.status(400).json({ erreur: "L'email et le mot de passe sont requis." });
    }

    const emailPropre = email.trim();
    const roleNormalise = role ? role.trim().toLowerCase() : '';

    if (roleNormalise === 'facturier') {
      compteService.trouverFacturierParEmail(db, emailPropre, (err, results) => {
        if (err) {
          console.error("Erreur SQL connexion facturier :", err);
          return res.status(500).json({ erreur: "Erreur serveur lors de la connexion." });
        }

        if (results.length === 0) {
          return res.status(404).json({ erreur: "Facturier introuvable avec cet email." });
        }

        const facturier = results[0];

        if (facturier.mot_de_passe !== motDePasse) {
          return res.status(401).json({ erreur: "Mot de passe incorrect." });
        }

        res.json({
          message: "Connexion réussie",
          admin: {
            id: facturier.id,
            nom: facturier.nom,
            prenom: facturier.prenom || '',
            postnom: facturier.postnom || '',
            email: facturier.email,
            role: facturier.role || 'Facturier'
          }
        });
      });
    } 
    else {
      compteService.trouverAdminParEmail(db, emailPropre, (err, results) => {
        if (err) {
          console.error("Erreur SQL connexion admin :", err);
          return res.status(500).json({ erreur: "Erreur serveur lors de la connexion." });
        }

        if (results.length === 0) {
          return res.status(404).json({ erreur: "Administrateur introuvable avec cet email." });
        }

        const admin = results[0];

        if (admin.motDePasse !== motDePasse) {
          return res.status(401).json({ erreur: "Mot de passe incorrect." });
        }

        res.json({
          message: "Connexion réussie",
          admin: {
            id: admin.id,
            nom: admin.nom,
            email: admin.email,
            role: admin.role || 'Administrateur'
          }
        });
      });
    }
  });

  // ==========================================
  // ROUTES FACTURIERS & LISTE ADMIN
  // ==========================================
  router.get('/admin', (req, res) => {
    const sql = "SELECT id, nom, email, role, NULL AS motDePasse, 'Admin' as typeRole FROM admin";
    db.query(sql, (err, results) => {
      if (err) {
        console.error("Erreur SQL récupération admin :", err);
        return res.status(500).json({ erreur: "Erreur lors de la récupération des administrateurs." });
      }
      res.json(results);
    });
  });

  router.get('/facturiers', (req, res) => {
    compteService.obtenirTousFacturiers(db, (err, results) => {
      if (err) {
        console.error("Erreur SQL récupération facturiers :", err);
        return res.status(500).json({ erreur: "Erreur lors de la récupération des facturiers." });
      }
      res.json(results);
    });
  });

  router.post('/facturiers', (req, res) => {
    const { prenom, nom, email, motDePasse, role = 'Facturier' } = req.body;

    if (!prenom || !nom || !email || !motDePasse) {
      return res.status(400).json({ erreur: "Tous les champs obligatoires doivent être remplis." });
    }

    const emailPropre = email.trim();

    compteService.trouverFacturierParEmail(db, emailPropre, (err, results) => {
      if (err) {
        console.error("Erreur SQL vérification email facturier :", err);
        return res.status(500).json({ erreur: "Erreur serveur lors de la vérification de l'email." });
      }

      if (results.length > 0) {
        return res.status(400).json({ erreur: "Cette adresse e-mail est déjà utilisée." });
      }

      compteService.insererFacturier(db, prenom.trim(), nom.trim(), emailPropre, motDePasse, role, (errInsert, resultat) => {
        if (errInsert) {
          console.error("Erreur lors de l'insertion du facturier :", errInsert);
          return res.status(500).json({ erreur: "Erreur lors de la création du compte facturier." });
        }

        res.status(201).json({
          success: true,
          message: "Compte facturier créé avec succès.",
          data: {
            id: resultat.insertId,
            prenom: prenom.trim(),
            nom: nom.trim(),
            email: emailPropre,
            role
          }
        });
      });
    });
  });

  // ==========================================
  // ROUTE DE MODIFICATION (Mise à jour complète)
  // ==========================================
  router.put('/utilisateurs/:id', (req, res) => {
    const { id } = req.params;
    const { prenom, nom, postnom, email, role, motDePasse, ancienRole } = req.body;

    if (!role) {
      return res.status(400).json({ erreur: "Le rôle est requis." });
    }

    const nouveauRoleNorm = role.trim().toLowerCase();
    const ancienRoleNorm = ancienRole ? ancienRole.trim().toLowerCase() : 'facturier';
    const prenomPropre = prenom ? prenom.trim() : '';
    const nomPropre = nom ? nom.trim() : '';
    const postnomPropre = postnom ? postnom.trim() : '';
    const emailPropre = email ? email.trim() : '';

    const executerMiseAJour = (pwdActuel) => {
      let mdpFinal = pwdActuel;
      if (ancienRoleNorm !== 'admin') {
        mdpFinal = (motDePasse && motDePasse.trim() !== '') ? motDePasse : pwdActuel;
      }

      // Cas 1 : Reste Facturier -> Met à jour prénom, nom, postnom, email, mdp et rôle
      if (ancienRoleNorm === 'facturier' && nouveauRoleNorm === 'facturier') {
        const sql = "UPDATE facturiers SET prenom = ?, nom = ?, postnom = ?, email = ?, mot_de_passe = ?, role = ? WHERE id = ?";
        db.query(sql, [prenomPropre, nomPropre, postnomPropre, emailPropre, mdpFinal, role, id], (err) => {
          if (err) {
            console.error("Erreur modification facturier :", err);
            return res.status(500).json({ erreur: "Erreur lors de la mise à jour." });
          }
          res.json({ 
            message: "Compte mis à jour avec succès.",
            id, prenom: prenomPropre, nom: nomPropre, postnom: postnomPropre, email: emailPropre, role 
          });
        });
      }
      // Cas 2 : Reste Admin -> Met à jour nom, email et rôle
      else if (ancienRoleNorm === 'admin' && nouveauRoleNorm === 'admin') {
        const nomComplet = `${prenomPropre} ${nomPropre} ${postnomPropre}`.trim() || nomPropre;
        const sql = "UPDATE admin SET nom = ?, email = ?, role = ? WHERE id = ?";
        db.query(sql, [nomComplet, emailPropre, role, id], (err) => {
          if (err) {
            console.error("Erreur modification admin :", err);
            return res.status(500).json({ erreur: "Erreur lors de la mise à jour." });
          }
          res.json({ 
            message: "Compte administrateur mis à jour avec succès.",
            id, nom: nomComplet, email: emailPropre, role 
          });
        });
      }
      // Cas 3 : Passe de Facturier à Admin
      else if (ancienRoleNorm === 'facturier' && nouveauRoleNorm === 'admin') {
        db.query("SELECT * FROM facturiers WHERE id = ?", [id], (err, results) => {
          if (err || results.length === 0) return res.status(404).json({ erreur: "Utilisateur introuvable." });
          const user = results[0];

          const nomComplet = `${prenomPropre} ${nomPropre} ${postnomPropre}`.trim() || `${user.prenom || ''} ${user.nom}`.trim();
          const sqlInsert = "INSERT INTO admin (nom, email, motDePasse, role) VALUES (?, ?, ?, ?)";
          
          db.query(sqlInsert, [nomComplet, emailPropre || user.email, mdpFinal, role], (errInsert) => {
            if (errInsert) {
              console.error("Erreur migration vers admin :", errInsert);
              return res.status(500).json({ erreur: "Erreur lors du changement de rôle." });
            }

            db.query("DELETE FROM facturiers WHERE id = ?", [id], (errDel) => {
              if (errDel) console.error("Erreur suppression ancienne table :", errDel);
              res.json({ message: "Utilisateur promu Admin avec succès." });
            });
          });
        });
      }
      // Cas 4 : Passe d'Admin à Facturier
      else if (ancienRoleNorm === 'admin' && nouveauRoleNorm === 'facturier') {
        db.query("SELECT * FROM admin WHERE id = ?", [id], (err, results) => {
          if (err || results.length === 0) return res.status(404).json({ erreur: "Utilisateur introuvable." });
          const user = results[0];

          const parts = user.nom.split(' ');
          const prenomFinal = prenomPropre || parts[0] || '';
          const nomFinal = nomPropre || parts.slice(1).join(' ') || user.nom;

          const sqlInsert = "INSERT INTO facturiers (prenom, nom, postnom, email, mot_de_passe, role) VALUES (?, ?, ?, ?, ?, ?)";
          
          db.query(sqlInsert, [prenomFinal, nomFinal, postnomPropre, emailPropre || user.email, pwdActuel, role], (errInsert) => {
            if (errInsert) {
              console.error("Erreur migration vers facturiers :", errInsert);
              return res.status(500).json({ erreur: "Erreur lors du changement de rôle." });
            }

            db.query("DELETE FROM admin WHERE id = ?", [id], (errDel) => {
              if (errDel) console.error("Erreur suppression ancienne table :", errDel);
              res.json({ message: "Utilisateur rétrogradé Facturier avec succès." });
            });
          });
        });
      }
    };

    const tableCible = ancienRoleNorm === 'admin' ? 'admin' : 'facturiers';
    const colonneMdp = ancienRoleNorm === 'admin' ? 'motDePasse' : 'mot_de_passe';

    db.query(`SELECT ${colonneMdp} AS mdp FROM ${tableCible} WHERE id = ?`, [id], (err, results) => {
      if (err || results.length === 0) {
        const autreTable = tableCible === 'admin' ? 'facturiers' : 'admin';
        const autreColMdp = autreTable === 'admin' ? 'motDePasse' : 'mot_de_passe';
        db.query(`SELECT ${autreColMdp} AS mdp FROM ${autreTable} WHERE id = ?`, [id], (err2, results2) => {
          if (err2 || results2.length === 0) {
            return res.status(404).json({ erreur: "Utilisateur introuvable en base de données." });
          }
          executerMiseAJour(results2[0].mdp);
        });
        return;
      }
      executerMiseAJour(results[0].mdp);
    });
  });

  router.delete('/facturiers/:id', (req, res) => {
    const { id } = req.params;
    compteService.supprimerFacturier(db, id, (err) => {
      if (err) {
        console.error("Erreur suppression facturier :", err);
        return res.status(500).json({ erreur: "Erreur lors de la suppression du facturier" });
      }
      res.json({ message: "Facturier supprimé avec succès" });
    });
  });

  return router;
}

module.exports = compteRoutes;