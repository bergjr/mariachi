import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import styles from './PageHero.module.scss'

export default function PageHero({ image, title, subtitle }) {
  return (
    <Box
      component="section"
      className={styles.hero}
      style={{ backgroundImage: `url(${image})` }}
    >
      <Box className={styles.overlay} />
      <Box className={styles.content}>
        <Typography variant="h2" className={styles.title}>
          {title}
        </Typography>
        {subtitle && (
          <Typography variant="body1" className={styles.subtitle}>
            {subtitle}
          </Typography>
        )}
      </Box>
    </Box>
  )
}
