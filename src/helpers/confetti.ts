import { confetti } from 'tsparticles-confetti'

// ----------------------------------------------------------------
// |  Find more examples here: https://confetti.js.org/more.html  |
// ----------------------------------------------------------------

export async function shotConfettiStars({
  withStars = true,
}: {
  withStars?: boolean
}) {
  const defaults = {
    spread: 360,
    ticks: 50,
    gravity: 0,
    decay: 0.94,
    startVelocity: 30,
  }

  function shoot() {
    if (withStars) {
      confetti({
        ...defaults,
        particleCount: 10,
        scalar: 1.2,
        shapes: ['star'],
        colors: ['FFE400', 'FFBD00', 'E89400', 'FFCA6C', 'FDFFB8'],
      })
    }

    confetti({
      ...defaults,
      particleCount: 40,
      scalar: 0.75,
      shapes: ['circle'],
    })
  }

  setTimeout(shoot, 0)
  setTimeout(shoot, 100)
  setTimeout(shoot, 200)
}
